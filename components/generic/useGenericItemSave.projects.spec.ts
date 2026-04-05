import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGenericItemSave } from './useGenericItemSave'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: { updateItem: vi.fn() },
}))

const mockUpdateItem = vi.mocked(centyClient.updateItem)

function makeItem(projects?: string[]) {
  const p = projects ?? []
  return {
    $typeName: 'centy.v1.GenericItem' as const,
    id: 'doc-1',
    itemType: 'docs',
    title: 'Original',
    body: 'body',
    metadata: {
      $typeName: 'centy.v1.GenericItemMetadata' as const,
      displayNumber: 0,
      status: '',
      priority: 0,
      createdAt: '',
      updatedAt: '',
      deletedAt: '',
      customFields: {},
      tags: [],
      projects: p,
    },
  }
}

function makeParams(
  overrides?: Partial<Parameters<typeof useGenericItemSave>[0]>
) {
  return {
    projectPath: '/my/project',
    itemType: 'docs',
    item: makeItem(),
    editTitle: 'Original',
    editBody: 'body',
    editStatus: '',
    editCustomFields: {},
    editProjects: ['/my/project'],
    setItem: vi.fn(),
    setIsEditing: vi.fn(),
    setError: vi.fn(),
    ...(overrides ?? {}),
  }
}

describe('useGenericItemSave - org-wide project changes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends projects when an org-wide item has a project removed', async () => {
    const orgItem = makeItem(['/my/project', '/other/project'])
    mockUpdateItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.UpdateItemResponse',
      success: true,
      error: '',
      item: makeItem(['/my/project']),
    })
    const { result } = renderHook(() =>
      useGenericItemSave(
        makeParams({ item: orgItem, editProjects: ['/my/project'] })
      )
    )
    await act(async () => {
      await result.current.handleSave()
    })
    expect(mockUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({ projects: ['/my/project'] })
    )
  })

  it('sends empty projects (no change) when org-wide item is unchanged', async () => {
    const orgItem = makeItem(['/my/project', '/other/project'])
    mockUpdateItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.UpdateItemResponse',
      success: true,
      error: '',
      item: orgItem,
    })
    const { result } = renderHook(() =>
      useGenericItemSave(
        makeParams({
          item: orgItem,
          editProjects: ['/my/project', '/other/project'],
        })
      )
    )
    await act(async () => {
      await result.current.handleSave()
    })
    expect(mockUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({ projects: [] })
    )
  })
})
