import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { route } from 'nextjs-routes'
import { useGenericItemDelete } from './useGenericItemDelete'
import { centyClient } from '@/lib/grpc/client'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    deleteItem: vi.fn(),
    softDeleteItem: vi.fn(),
    restoreItem: vi.fn(),
  },
}))

const mockRestoreItem = vi.mocked(centyClient.restoreItem)

const mockItem = {
  $typeName: 'centy.v1.GenericItem' as const,
  id: 'item-1',
  itemType: 'docs',
  title: 'My Doc',
  body: '',
  metadata: {
    $typeName: 'centy.v1.GenericItemMetadata' as const,
    displayNumber: 1,
    status: '',
    priority: 0,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
    customFields: {},
    tags: [],
  },
}

const defaultParams = {
  projectPath: '/test/project',
  itemType: 'docs',
  item: mockItem,
  listUrl: route({ pathname: '/[...path]', query: { path: ['docs'] } }),
  setError: vi.fn(),
  setItem: vi.fn(),
}

describe('useGenericItemDelete - restore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('restores an item and updates item state', async () => {
    const restoredItem = {
      ...mockItem,
      metadata: { ...mockItem.metadata, deletedAt: '' },
    }
    mockRestoreItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.RestoreItemResponse',
      success: true,
      error: '',
      item: restoredItem,
    })

    const { result } = renderHook(() => useGenericItemDelete(defaultParams))

    await act(async () => {
      await result.current.handleRestore()
    })

    expect(mockRestoreItem).toHaveBeenCalledWith(
      expect.objectContaining({ itemId: 'item-1' })
    )
    expect(defaultParams.setItem).toHaveBeenCalledWith(restoredItem)
  })

  it('sets error when restore fails', async () => {
    mockRestoreItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.RestoreItemResponse',
      success: false,
      error: 'Failed to restore',
      item: undefined,
    })

    const { result } = renderHook(() => useGenericItemDelete(defaultParams))

    await act(async () => {
      await result.current.handleRestore()
    })

    expect(defaultParams.setError).toHaveBeenCalledWith('Failed to restore')
  })
})
