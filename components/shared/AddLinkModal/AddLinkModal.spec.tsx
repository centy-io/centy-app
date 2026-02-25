import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AddLinkModal } from '.'
import {
  LinkTargetType,
  type Link as LinkType,
  type LinkTypeInfo,
  type GenericItem,
} from '@/gen/centy_pb'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    getAvailableLinkTypes: vi.fn(),
    listItems: vi.fn(),
    createLink: vi.fn(),
  },
}))

const mockUsePathContext = vi.fn()
vi.mock('@/components/providers/PathContextProvider', () => ({
  usePathContext: () => mockUsePathContext(),
}))

const createMockLinkTypeInfo = (
  name: string,
  inverse: string,
  description = ''
): LinkTypeInfo =>
  ({
    name,
    inverse,
    description,
    $typeName: 'centy.v1.LinkTypeInfo' as const,
    $unknown: undefined,
  }) as LinkTypeInfo

const createMockGenericItem = (overrides: {
  id?: string
  itemType?: string
  title?: string
  body?: string
  displayNumber?: number
  status?: string
}): GenericItem =>
  ({
    id: overrides.id || 'item-1',
    itemType: overrides.itemType || 'issues',
    title: overrides.title || 'Test Item',
    body: overrides.body || '',
    metadata: {
      displayNumber: overrides.displayNumber || 1,
      status: overrides.status || 'open',
      priority: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: '',
      customFields: {},
      $typeName: 'centy.v1.GenericItemMetadata' as const,
      $unknown: undefined,
    },
    $typeName: 'centy.v1.GenericItem' as const,
    $unknown: undefined,
  }) as GenericItem

const makeListItemsResponse = (items: GenericItem[]) => ({
  items,
  totalCount: items.length,
  $typeName: 'centy.v1.ListItemsResponse' as const,
  $unknown: undefined,
  success: true,
  error: '',
})

const mockOnClose = vi.fn()
const mockOnLinkCreated = vi.fn()
const emptyLinks: LinkType[] = []
const defaultProps = {
  entityId: 'entity-123',
  entityType: 'issue' as const,
  existingLinks: emptyLinks,
  onClose: mockOnClose,
  onLinkCreated: mockOnLinkCreated,
}

function setupAddLinkModalMocks() {
  vi.clearAllMocks()
  mockUsePathContext.mockReturnValue({
    projectPath: '/test/project',
  })

  vi.mocked(centyClient.getAvailableLinkTypes).mockResolvedValue({
    linkTypes: [
      createMockLinkTypeInfo(
        'blocks',
        'blocked-by',
        'This issue blocks another'
      ),
      createMockLinkTypeInfo('related-to', 'related-to', 'Related items'),
    ],
    $typeName: 'centy.v1.GetAvailableLinkTypesResponse',
    $unknown: undefined,
  })

  vi.mocked(centyClient.listItems).mockResolvedValue(
    makeListItemsResponse([
      createMockGenericItem({
        id: 'issue-1',
        displayNumber: 1,
        title: 'First Issue',
      }),
      createMockGenericItem({
        id: 'issue-2',
        displayNumber: 2,
        title: 'Second Issue',
      }),
    ])
  )
}

describe('AddLinkModal - Display and loading', () => {
  beforeEach(setupAddLinkModalMocks)

  it('should render modal with header and close button', async () => {
    render(<AddLinkModal {...defaultProps} />)

    expect(screen.getByText('Add Link')).toBeInTheDocument()
    expect(screen.getByText('x')).toBeInTheDocument()
  })

  it('should load and display link types', async () => {
    render(<AddLinkModal {...defaultProps} />)

    await waitFor(() => {
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })

    // Check that link types are in the dropdown
    const options = screen.getAllByRole('option')
    expect(options.length).toBe(2)
  })

  it('should show loading state while fetching link types', () => {
    vi.mocked(centyClient.getAvailableLinkTypes).mockImplementation(
      () => new Promise(() => {})
    )

    render(<AddLinkModal {...defaultProps} />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should display target type tabs', async () => {
    render(<AddLinkModal {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Issues')).toBeInTheDocument()
      expect(screen.getByText('Docs')).toBeInTheDocument()
    })
  })

  it('should switch to docs tab and load docs', async () => {
    render(<AddLinkModal {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Docs')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Docs'))

    await waitFor(() => {
      expect(centyClient.listItems).toHaveBeenCalled()
    })
  })
})

describe('AddLinkModal - Search and filtering', () => {
  beforeEach(setupAddLinkModalMocks)

  it('should filter search results based on search query', async () => {
    render(<AddLinkModal {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('#1 - First Issue')).toBeInTheDocument()
      expect(screen.getByText('#2 - Second Issue')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(
      'Search by title or number...'
    )
    fireEvent.change(searchInput, { target: { value: 'First' } })

    await waitFor(() => {
      expect(screen.getByText('#1 - First Issue')).toBeInTheDocument()
      expect(screen.queryByText('#2 - Second Issue')).not.toBeInTheDocument()
    })
  })

  it('should exclude self from search results', async () => {
    vi.mocked(centyClient.listItems).mockResolvedValue(
      makeListItemsResponse([
        createMockGenericItem({
          id: 'entity-123',
          displayNumber: 1,
          title: 'Self Issue',
        }),
        createMockGenericItem({
          id: 'other-issue',
          displayNumber: 2,
          title: 'Other Issue',
        }),
      ])
    )

    render(<AddLinkModal {...defaultProps} />)

    await waitFor(() => {
      expect(screen.queryByText('#1 - Self Issue')).not.toBeInTheDocument()
      expect(screen.getByText('#2 - Other Issue')).toBeInTheDocument()
    })
  })
})

describe('AddLinkModal - Item selection', () => {
  beforeEach(setupAddLinkModalMocks)

  it('should select a target item when clicked', async () => {
    render(<AddLinkModal {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('#1 - First Issue')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('#1 - First Issue'))

    await waitFor(() => {
      // Should show preview
      expect(screen.getByText('This will create:')).toBeInTheDocument()
    })
  })

  it('should show link preview with inverse link type', async () => {
    render(<AddLinkModal {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('#1 - First Issue')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('#1 - First Issue'))

    await waitFor(() => {
      expect(screen.getByText('Inverse link:')).toBeInTheDocument()
    })
  })
})

describe('AddLinkModal - Close behavior', () => {
  beforeEach(setupAddLinkModalMocks)

  it('should call onClose when close button is clicked', async () => {
    render(<AddLinkModal {...defaultProps} />)

    fireEvent.click(screen.getByText('x'))

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should call onClose when cancel button is clicked', async () => {
    render(<AddLinkModal {...defaultProps} />)

    fireEvent.click(screen.getByText('Cancel'))

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should call onClose when clicking outside modal', async () => {
    render(<AddLinkModal {...defaultProps} />)

    // Click on overlay
    const overlay = document.querySelector('.link-modal-overlay')
    if (overlay) {
      fireEvent.mouseDown(overlay)
    }

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should call onClose when pressing Escape', async () => {
    render(<AddLinkModal {...defaultProps} />)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(mockOnClose).toHaveBeenCalled()
  })
})

describe('AddLinkModal - Link creation', () => {
  beforeEach(setupAddLinkModalMocks)

  it('should create link when clicking Create Link button', async () => {
    vi.mocked(centyClient.createLink).mockResolvedValue({
      success: true,
      error: '',
      $typeName: 'centy.v1.CreateLinkResponse',
      $unknown: undefined,
    })

    render(<AddLinkModal {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('#1 - First Issue')).toBeInTheDocument()
    })

    // Select a target
    fireEvent.click(screen.getByText('#1 - First Issue'))

    // Click create
    const createButton = screen.getByText('Create Link')
    expect(createButton).not.toBeDisabled()
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(centyClient.createLink).toHaveBeenCalled()
      expect(mockOnLinkCreated).toHaveBeenCalled()
    })
  })

  it('should show error when link creation fails', async () => {
    vi.mocked(centyClient.createLink).mockResolvedValue({
      success: false,
      error: 'Link already exists',
      $typeName: 'centy.v1.CreateLinkResponse',
      $unknown: undefined,
    })

    render(<AddLinkModal {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('#1 - First Issue')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('#1 - First Issue'))
    fireEvent.click(screen.getByText('Create Link'))

    await waitFor(() => {
      expect(screen.getByText('Link already exists')).toBeInTheDocument()
    })
  })

  it('should disable Create Link button when no target is selected', async () => {
    render(<AddLinkModal {...defaultProps} />)

    await waitFor(() => {
      const createButton = screen.getByText('Create Link')
      expect(createButton).toBeDisabled()
    })
  })
})

describe('AddLinkModal - Empty state and exclusions', () => {
  beforeEach(setupAddLinkModalMocks)

  it('should show empty state when no search results', async () => {
    vi.mocked(centyClient.listItems).mockResolvedValue(
      makeListItemsResponse([])
    )

    render(<AddLinkModal {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('No items found')).toBeInTheDocument()
    })
  })

  it('should exclude existing links from search results', async () => {
    const existingLinks: LinkType[] = [
      {
        targetId: 'issue-1',
        targetType: LinkTargetType.ISSUE,
        linkType: 'blocks',
        createdAt: '2026-01-01T00:00:00Z',
        $typeName: 'centy.v1.Link',
        $unknown: undefined,
      },
    ]

    render(<AddLinkModal {...defaultProps} existingLinks={existingLinks} />)

    await waitFor(() => {
      // issue-1 should be excluded because it already has a 'blocks' link
      expect(screen.queryByText('#1 - First Issue')).not.toBeInTheDocument()
      expect(screen.getByText('#2 - Second Issue')).toBeInTheDocument()
    })
  })
})
