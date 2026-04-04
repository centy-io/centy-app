import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createMockLinkTypeInfo,
  createMockGenericItem,
  makeListItemsResponse,
  makeListItemTypesResponse,
} from './AddLinkModal.spec-utils'
import { AddLinkModal } from '.'
import type { Link as LinkType } from '@/gen/centy_pb'
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

  vi.mocked(centyClient.listItemTypes).mockResolvedValue(
    makeListItemTypesResponse()
  )

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
        targetItemType: 'issue',
        linkType: 'blocks',
        createdAt: '2026-01-01T00:00:00Z',
        $typeName: 'centy.v1.Link',
        $unknown: undefined,
      },
    ]

    render(<AddLinkModal {...defaultProps} existingLinks={existingLinks} />)

    await waitFor(() => {
      expect(screen.queryByText('#1 - First Issue')).not.toBeInTheDocument()
      expect(screen.getByText('#2 - Second Issue')).toBeInTheDocument()
    })
  })
})
