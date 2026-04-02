import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchItemList } from './fetchItemList'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    listItems: vi.fn(),
  },
}))

const mockListItems = vi.mocked(centyClient.listItems)

describe('fetchItemList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns items on success', async () => {
    const mockItems = [
      {
        $typeName: 'centy.v1.GenericItem' as const,
        id: 'item-1',
        itemType: 'docs',
        title: 'Doc 1',
        body: '',
        metadata: undefined,
      },
    ]
    mockListItems.mockResolvedValueOnce({
      $typeName: 'centy.v1.ListItemsResponse',
      items: mockItems,
      totalCount: 1,
      success: true,
      error: '',
    })

    const result = await fetchItemList('/project', 'docs')

    expect(result.items).toHaveLength(1)
    expect(result.error).toBeNull()
  })

  it('returns error message on failure', async () => {
    const err = new Error()
    err.message = 'Connection failed'
    mockListItems.mockRejectedValueOnce(err)

    const result = await fetchItemList('/project', 'docs')

    expect(result.items).toHaveLength(0)
    expect(result.error).toBe('Connection failed')
  })
})
