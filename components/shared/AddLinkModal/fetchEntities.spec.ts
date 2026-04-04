import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchEntities } from './fetchEntities'
import {
  makeListItemsResponse,
  createMockGenericItem,
} from './AddLinkModal.spec-utils'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    listItems: vi.fn(),
  },
}))

describe('fetchEntities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls listItems without an itemType filter', async () => {
    vi.mocked(centyClient.listItems).mockResolvedValue(
      makeListItemsResponse([])
    )
    await fetchEntities('/project', 'entity-id', [], 'blocks', '')
    expect(centyClient.listItems).toHaveBeenCalledOnce()
    const call = vi.mocked(centyClient.listItems).mock.calls[0][0]
    expect(call.itemType).toBe('')
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
