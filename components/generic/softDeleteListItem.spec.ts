import { describe, it, expect, vi, beforeEach } from 'vitest'
import { softDeleteListItem } from './softDeleteListItem'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    softDeleteItem: vi.fn(),
  },
}))

const mockSoftDeleteItem = vi.mocked(centyClient.softDeleteItem)

describe('softDeleteListItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns true on success', async () => {
    mockSoftDeleteItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.SoftDeleteItemResponse',
      success: true,
      error: '',
    })

    const setDeleting = vi.fn()
    const setError = vi.fn()

    const result = await softDeleteListItem(
      '/project',
      'docs',
      'item-1',
      setDeleting,
      setError
    )

    expect(result).toBe(true)
  })

  it('sets error and returns false on failure', async () => {
    mockSoftDeleteItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.SoftDeleteItemResponse',
      success: false,
      error: 'Archive failed',
    })

    const setDeleting = vi.fn()
    const setError = vi.fn()

    const result = await softDeleteListItem(
      '/project',
      'docs',
      'item-1',
      setDeleting,
      setError
    )

    expect(result).toBe(false)
    expect(setError).toHaveBeenCalledWith('Archive failed')
  })
})
