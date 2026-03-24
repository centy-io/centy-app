import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGenericItemsData } from './useGenericItemsData'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    listItems: vi.fn(),
    deleteItem: vi.fn(),
    softDeleteItem: vi.fn(),
  },
}))

const mockListItems = vi.mocked(centyClient.listItems)
const mockDeleteItem = vi.mocked(centyClient.deleteItem)
const mockSoftDeleteItem = vi.mocked(centyClient.softDeleteItem)

const mockItem = {
  $typeName: 'centy.v1.GenericItem' as const,
  id: 'getting-started',
  itemType: 'docs',
  title: 'Getting Started',
  body: '# Getting Started',
  metadata: {
    $typeName: 'centy.v1.GenericItemMetadata' as const,
    displayNumber: 0,
    status: '',
    priority: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    deletedAt: '',
    customFields: {},
    tags: [],
  },
}

describe('useGenericItemsData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches items when projectPath and isInitialized are set', async () => {
    mockListItems.mockResolvedValueOnce({
      $typeName: 'centy.v1.ListItemsResponse',
      items: [mockItem],
      totalCount: 1,
      success: true,
      error: '',
    })

    const { result } = renderHook(() =>
      useGenericItemsData('/test/project', true, 'docs')
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(mockListItems).toHaveBeenCalledWith(
      expect.objectContaining({ itemType: 'docs' })
    )
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].id).toBe('getting-started')
  })

  it('does not fetch when isInitialized is false', async () => {
    renderHook(() => useGenericItemsData('/test/project', false, 'docs'))

    await act(async () => {
      await Promise.resolve()
    })

    expect(mockListItems).not.toHaveBeenCalled()
  })

  it('does not fetch when projectPath is empty', async () => {
    renderHook(() => useGenericItemsData('', true, 'docs'))

    await act(async () => {
      await Promise.resolve()
    })

    expect(mockListItems).not.toHaveBeenCalled()
  })

  it('sets error state when fetch fails', async () => {
    const err = new Error()
    err.message = 'Daemon unavailable'
    mockListItems.mockRejectedValueOnce(err)

    const { result } = renderHook(() =>
      useGenericItemsData('/test/project', true, 'docs')
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.error).toBe('Daemon unavailable')
    expect(result.current.items).toHaveLength(0)
  })

  it('deletes an item and removes it from state', async () => {
    mockListItems.mockResolvedValueOnce({
      $typeName: 'centy.v1.ListItemsResponse',
      items: [mockItem],
      totalCount: 1,
      success: true,
      error: '',
    })
    mockDeleteItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.DeleteItemResponse',
      success: true,
      error: '',
    })

    const { result } = renderHook(() =>
      useGenericItemsData('/test/project', true, 'docs')
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.items).toHaveLength(1)

    await act(async () => {
      await result.current.handleDelete('getting-started')
    })

    expect(result.current.items).toHaveLength(0)
  })

  it('soft deletes an item and removes it from state', async () => {
    mockListItems.mockResolvedValueOnce({
      $typeName: 'centy.v1.ListItemsResponse',
      items: [mockItem],
      totalCount: 1,
      success: true,
      error: '',
    })
    mockSoftDeleteItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.SoftDeleteItemResponse',
      success: true,
      error: '',
      item: undefined,
    })

    const { result } = renderHook(() =>
      useGenericItemsData('/test/project', true, 'docs')
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.items).toHaveLength(1)

    await act(async () => {
      await result.current.handleSoftDelete('getting-started')
    })

    expect(mockSoftDeleteItem).toHaveBeenCalledWith(
      expect.objectContaining({ itemId: 'getting-started' })
    )
    expect(result.current.items).toHaveLength(0)
  })
})
