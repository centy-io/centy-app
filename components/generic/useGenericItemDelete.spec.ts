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

const mockDeleteItem = vi.mocked(centyClient.deleteItem)
const mockSoftDeleteItem = vi.mocked(centyClient.softDeleteItem)
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

describe('useGenericItemDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hard deletes an item and navigates to list on success', async () => {
    mockDeleteItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.DeleteItemResponse',
      success: true,
      error: '',
    })

    const { result } = renderHook(() => useGenericItemDelete(defaultParams))

    await act(async () => {
      await result.current.handleDelete()
    })

    expect(mockDeleteItem).toHaveBeenCalledWith(
      expect.objectContaining({ itemId: 'item-1' })
    )
    expect(mockPush).toHaveBeenCalledWith('/docs')
  })

  it('sets error when hard delete fails', async () => {
    mockDeleteItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.DeleteItemResponse',
      success: false,
      error: 'Permission denied',
    })

    const { result } = renderHook(() => useGenericItemDelete(defaultParams))

    await act(async () => {
      await result.current.handleDelete()
    })

    expect(defaultParams.setError).toHaveBeenCalledWith('Permission denied')
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('soft deletes an item and navigates to list on success', async () => {
    mockSoftDeleteItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.SoftDeleteItemResponse',
      success: true,
      error: '',
      item: {
        ...mockItem,
        metadata: { ...mockItem.metadata, deletedAt: '2026-01-01T00:00:00Z' },
      },
    })

    const { result } = renderHook(() => useGenericItemDelete(defaultParams))

    await act(async () => {
      await result.current.handleSoftDelete()
    })

    expect(mockSoftDeleteItem).toHaveBeenCalledWith(
      expect.objectContaining({ itemId: 'item-1' })
    )
    expect(mockPush).toHaveBeenCalledWith('/docs')
  })

  it('sets error when soft delete fails', async () => {
    mockSoftDeleteItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.SoftDeleteItemResponse',
      success: false,
      error: 'Failed to archive',
      item: undefined,
    })

    const { result } = renderHook(() => useGenericItemDelete(defaultParams))

    await act(async () => {
      await result.current.handleSoftDelete()
    })

    expect(defaultParams.setError).toHaveBeenCalledWith('Failed to archive')
    expect(mockPush).not.toHaveBeenCalled()
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
