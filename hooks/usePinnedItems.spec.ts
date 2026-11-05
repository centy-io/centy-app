import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { usePinnedItems } from './usePinnedItems'

vi.mock('@/components/providers/PathContextProvider', () => ({
  usePathContext: () => ({ projectPath: '/test/project' }),
}))

const KEY = 'centy-pinned-items-/test/project'
const item = { id: '1', type: 'issue' as const, title: 'Test' }

describe('usePinnedItems', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads pins saved under the existing storage key', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ items: [{ ...item, pinnedAt: 1 }] })
    )
    const { result } = renderHook(() => usePinnedItems())
    expect(result.current.isPinned('1')).toBe(true)
  })

  it('ignores a malformed stored value', () => {
    localStorage.setItem(KEY, JSON.stringify({ items: 'nope' }))
    const { result } = renderHook(() => usePinnedItems())
    expect(result.current.pinnedItems).toEqual([])
  })

  it('pins once, persists, and syncs other hook instances', () => {
    const a = renderHook(() => usePinnedItems())
    const b = renderHook(() => usePinnedItems())
    act(() => {
      a.result.current.pinItem(item)
      a.result.current.pinItem(item)
    })
    expect(a.result.current.pinnedItems).toHaveLength(1)
    expect(b.result.current.isPinned('1')).toBe(true)
    expect(localStorage.getItem(KEY)).toContain('"id":"1"')
  })

  it('unpins and reorders', () => {
    const { result } = renderHook(() => usePinnedItems())
    act(() => {
      result.current.pinItem(item)
      result.current.pinItem({ ...item, id: '2' })
    })
    act(() => {
      result.current.reorderItems(0, 1)
    })
    expect(result.current.pinnedItems.map(p => p.id)).toEqual(['2', '1'])
    act(() => {
      result.current.unpinItem('2')
    })
    expect(result.current.pinnedItems.map(p => p.id)).toEqual(['1'])
  })
})
