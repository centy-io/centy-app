import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createMockLinkTypeInfo,
  createMockGenericItem,
  makeListItemsResponse,
} from './AddLinkModal.spec-utils'
import { AddLinkModal } from '.'
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

const mockOnClose = vi.fn()
const mockOnLinkCreated = vi.fn()
const defaultProps = {
  entityId: 'entity-123',
  entityType: 'issue' as const,
  existingLinks: [],
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

    const options = screen.getAllByRole('option')
    expect(options.length).toBe(2)
  })

  it('should show loading state while fetching link types', () => {
    vi.mocked(centyClient.getAvailableLinkTypes).mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
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
})
