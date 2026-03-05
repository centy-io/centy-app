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
  },
}

describe('useGenericItemFetch - init and edge cases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not fetch when projectPath is empty', async () => {
    renderHook(() => useGenericItemFetch('', 'docs', 'getting-started'))

    await act(async () => {
      await Promise.resolve()
    })

    expect(mockGetItem).not.toHaveBeenCalled()
  })

  it('initializes edit fields from fetched item', async () => {
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

    expect(result.current.editTitle).toBe('Getting Started')
    expect(result.current.editBody).toBe('# Getting Started\n\nWelcome!')
    expect(result.current.editStatus).toBe('')
  })
})
