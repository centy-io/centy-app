import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteListItem } from './deleteListItem'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    deleteItem: vi.fn(),
  },
}))

const mockDeleteItem = vi.mocked(centyClient.deleteItem)

describe('deleteListItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns true on success', async () => {
    mockDeleteItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.DeleteItemResponse',
      success: true,
      error: '',
    })

    const setDeleting = vi.fn()
    const setError = vi.fn()

    const result = await deleteListItem(
      '/project',
      'docs',
      'item-1',
      setDeleting,
      setError
    )

    expect(result).toBe(true)
  })

  it('sets error and returns false on failure', async () => {
    mockDeleteItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.DeleteItemResponse',
      success: false,
      error: 'Delete failed',
    })

    const setDeleting = vi.fn()
    const setError = vi.fn()

    const result = await deleteListItem(
      '/project',
      'docs',
      'item-1',
      setDeleting,
      setError
    )

    expect(result).toBe(false)
    expect(setError).toHaveBeenCalledWith('Delete failed')
  })
})
