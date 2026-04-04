import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchEntities } from './fetchEntities'
import {
  makeListItemsResponse,
  makeListItemTypesResponse,
  createMockGenericItem,
} from './AddLinkModal.spec-utils'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    listItemTypes: vi.fn(),
    listItems: vi.fn(),
  },
}))

describe('fetchEntities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(centyClient.listItemTypes).mockResolvedValue(
      makeListItemTypesResponse(['issues'])
    )
    vi.mocked(centyClient.listItems).mockResolvedValue(
      makeListItemsResponse([])
    )
  })

  it('calls listItemTypes then listItems for each item type', async () => {
    await fetchEntities('/project', 'entity-id', [], 'blocks', '')
    expect(centyClient.listItemTypes).toHaveBeenCalledOnce()
    expect(centyClient.listItems).toHaveBeenCalledOnce()
  })

  it('returns filtered and mapped entities', async () => {
    vi.mocked(centyClient.listItems).mockResolvedValue(
      makeListItemsResponse([
        createMockGenericItem({
          id: 'i1',
          title: 'Issue One',
          displayNumber: 1,
        }),
        createMockGenericItem({
          id: 'entity-id',
          title: 'Self',
          displayNumber: 2,
        }),
      ])
    )
    const result = await fetchEntities(
      '/project',
      'entity-id',
      [],
      'blocks',
      ''
    )
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('i1')
  })
})
