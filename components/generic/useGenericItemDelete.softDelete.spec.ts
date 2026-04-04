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

const mockSoftDeleteItem = vi.mocked(centyClient.softDeleteItem)

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
    projects: [],
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

describe('useGenericItemDelete - soft delete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
})
