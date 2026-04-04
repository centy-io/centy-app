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

const defaultProps = {
  entityId: 'entity-123',
  entityType: 'issue' as const,
  existingLinks: [],
  onClose: vi.fn(),
  onLinkCreated: vi.fn(),
}

function setupAddLinkModalMocks() {
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

describe('AddLinkModal - Search and filtering', () => {
  beforeEach(setupAddLinkModalMocks)

  it('should filter search results based on search query', async () => {
    render(<AddLinkModal {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText(
      'Search by title or number...'
    )
    fireEvent.focus(searchInput)
    await waitFor(() => {
      expect(screen.getByText('#1 - First Issue')).toBeInTheDocument()
      expect(screen.getByText('#2 - Second Issue')).toBeInTheDocument()
    })

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

    fireEvent.focus(screen.getByPlaceholderText('Search by title or number...'))
    await waitFor(() => {
      expect(screen.queryByText('#1 - Self Issue')).not.toBeInTheDocument()
      expect(screen.getByText('#2 - Other Issue')).toBeInTheDocument()
    })
  })
})
