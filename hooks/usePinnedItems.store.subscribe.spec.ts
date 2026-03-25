import { describe, it, expect, vi, beforeEach } from 'vitest'
import { subscribe, getSnapshot, updateState } from './usePinnedItems.store'

let testCounter = 0
function uniquePath(): string {
  return `/test/project-${++testCounter}`
}

describe('subscribe', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('returns unsubscribe function', () => {
    const path = uniquePath()
    const listener = vi.fn()

    const unsubscribe = subscribe(path, listener)
    unsubscribe()

    updateState(path, prev => prev)

    expect(listener).not.toHaveBeenCalled()
  })

  it('only removes the specific listener on unsubscribe', () => {
    const path = uniquePath()
    const listener1 = vi.fn()
    const listener2 = vi.fn()

    const unsubscribe1 = subscribe(path, listener1)
    subscribe(path, listener2)
    unsubscribe1()

    updateState(path, prev => prev)

    expect(listener1).not.toHaveBeenCalled()
    expect(listener2).toHaveBeenCalledTimes(1)
  })
})

describe('integration: pin/unpin workflow', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('can add and remove pinned items', () => {
    const path = uniquePath()
    const item = {
      id: 'abc',
      type: 'issue' as const,
      title: 'Bug fix',
      pinnedAt: 1000,
    }

    updateState(path, prev => ({ items: [...prev.items, item] }))
    expect(getSnapshot(path).items).toHaveLength(1)

    updateState(path, prev => ({
      items: prev.items.filter(i => i.id !== item.id),
    }))
    expect(getSnapshot(path).items).toHaveLength(0)
  })

  it('maintains separate state per projectPath', () => {
    const path1 = uniquePath()
    const path2 = uniquePath()
    const item = {
      id: '1',
      type: 'issue' as const,
      title: 'Issue',
      pinnedAt: 1000,
    }

    updateState(path1, () => ({ items: [item] }))

    expect(getSnapshot(path1).items).toHaveLength(1)
    expect(getSnapshot(path2).items).toHaveLength(0)
  })

  it('state persists across getSnapshot calls', () => {
    const path = uniquePath()
    const item = {
      id: '1',
      type: 'doc' as const,
      title: 'Doc',
      pinnedAt: 1000,
    }

    updateState(path, () => ({ items: [item] }))

    expect(getSnapshot(path)).toEqual(getSnapshot(path))
  })
})
