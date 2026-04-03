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

const mockUsePathContext = vi.fn<() => unknown>()
vi.mock('@/components/providers/PathContextProvider', () => ({
  usePathContext: () => mockUsePathContext(),
}))

const mockOnLinkCreated = vi.fn()
const defaultProps = {
  entityId: 'entity-123',
  entityType: 'issue' as const,
  existingLinks: [],
  onClose: vi.fn(),
  onLinkCreated: mockOnLinkCreated,
}

function setupAddLinkModalMocks() {
  vi.clearAllMocks()
  mockUsePathContext.mockReturnValue({ projectPath: '/test/project' })

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

    fireEvent.click(screen.getByText('#1 - First Issue'))

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
})
