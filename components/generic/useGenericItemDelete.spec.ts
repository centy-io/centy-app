import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { route } from 'nextjs-routes'
import { useGenericItemDelete } from './useGenericItemDelete'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    deleteItem: vi.fn(),
    softDeleteItem: vi.fn(),
    restoreItem: vi.fn(),
  },
}))

describe('useGenericItemDelete - initial state', () => {
  it('returns deleting and restoring as false initially', () => {
    const { result } = renderHook(() =>
      useGenericItemDelete({
        projectPath: '/test/project',
        itemType: 'docs',
        item: null,
        listUrl: route({ pathname: '/[...path]', query: { path: ['docs'] } }),
        setError: vi.fn(),
      })
    )

    expect(result.current.deleting).toBe(false)
    expect(result.current.restoring).toBe(false)
    expect(typeof result.current.handleDelete).toBe('function')
    expect(typeof result.current.handleSoftDelete).toBe('function')
    expect(typeof result.current.handleRestore).toBe('function')
  })
})
