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
const defaultProps = {
  entityId: 'entity-123',
  entityType: 'issue' as const,
  existingLinks: [],
  onClose: mockOnClose,
  onLinkCreated: vi.fn(),
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
    ])
  )
}

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
