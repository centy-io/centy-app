import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createMockLinkTypeInfo,
  createMockGenericItem,
  makeListItemsResponse,
  makeListItemTypesResponse,
} from './AddLinkModal.spec-utils'
import { AddLinkModal } from '.'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    getAvailableLinkTypes: vi.fn(),
    listItemTypes: vi.fn(),
    listItems: vi.fn(),
    createLink: vi.fn(),
  },
}))

const mockUsePathContext = vi.fn<() => unknown>()
vi.mock('@/components/providers/PathContextProvider', () => ({
  usePathContext: () => mockUsePathContext(),
}))

const defaultProps = {
  entityId: 'entity-123',
  entityType: 'issue' as const,
  existingLinks: [],
  onClose: vi.fn(),
  onLinkCreated: vi.fn(),
}

function setupMocks() {
  vi.clearAllMocks()
  mockUsePathContext.mockReturnValue({ projectPath: '/test/project' })
  vi.mocked(centyClient.getAvailableLinkTypes).mockResolvedValue({
    linkTypes: [
      createMockLinkTypeInfo('blocks', 'This issue blocks another'),
      createMockLinkTypeInfo('related-to', 'Related items'),
    ],
    $typeName: 'centy.v1.GetAvailableLinkTypesResponse',
    $unknown: undefined,
  })
  vi.mocked(centyClient.listItemTypes).mockResolvedValue(
    makeListItemTypesResponse(['issues'])
  )
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

describe('AddLinkModal - Link creation', () => {
  beforeEach(setupMocks)

  it('should create link when clicking Create Link button', async () => {
    vi.mocked(centyClient.createLink).mockResolvedValue({
      success: true,
      error: '',
      $typeName: 'centy.v1.CreateLinkResponse',
      $unknown: undefined,
    })

    render(<AddLinkModal {...defaultProps} />)

    fireEvent.focus(screen.getByPlaceholderText('Search by title or number...'))
    await waitFor(() => {
      expect(screen.getByText('#1 - First Issue')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('#1 - First Issue'))

    const createButton = screen.getByText('Create Link')
    expect(createButton).not.toBeDisabled()
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(centyClient.createLink).toHaveBeenCalled()
      expect(defaultProps.onLinkCreated).toHaveBeenCalled()
    })
  })
})
