import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGenericItemFetch } from './useGenericItemFetch'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    getItem: vi.fn(),
  },
}))

const mockGetItem = vi.mocked(centyClient.getItem)

const mockItem = {
  $typeName: 'centy.v1.GenericItem' as const,
  id: 'getting-started',
  itemType: 'docs',
  title: 'Getting Started',
  body: '# Getting Started\n\nWelcome!',
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

describe('useGenericItemFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches an item by itemId', async () => {
    mockGetItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.GetItemResponse',
      success: true,
      error: '',
      item: mockItem,
    })

    const { result } = renderHook(() =>
      useGenericItemFetch('/test/project', 'docs', 'getting-started')
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(mockGetItem).toHaveBeenCalledWith(
      expect.objectContaining({
        itemType: 'docs',
        itemId: 'getting-started',
      })
    )
    expect(result.current.item).not.toBeNull()
    expect(result.current.item && result.current.item.id).toBe(
      'getting-started'
    )
    expect(result.current.item && result.current.item.title).toBe(
      'Getting Started'
    )
    expect(result.current.editTitle).toBe('Getting Started')
    expect(result.current.editBody).toBe('# Getting Started\n\nWelcome!')
  })

  it('sets error when item is not found', async () => {
    mockGetItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.GetItemResponse',
      success: false,
      error: 'Doc not found',
    })

    const { result } = renderHook(() =>
      useGenericItemFetch('/test/project', 'docs', 'nonexistent')
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.item).toBeNull()
  })

  it('sets error when fetch throws', async () => {
    const err = new Error()
    err.message = 'Connection refused'
    mockGetItem.mockRejectedValueOnce(err)

    const { result } = renderHook(() =>
      useGenericItemFetch('/test/project', 'docs', 'getting-started')
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.error).toBe('Connection refused')
    expect(result.current.item).toBeNull()
  })
})
