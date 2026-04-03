import { describe, it, expect, vi, beforeEach } from 'vitest'
import { subscribe, getSnapshot, updateState } from './usePinnedItems.store'
import type { PinnedItemsState } from './pinnedItemsState'

let testCounter = 0
function uniquePath(): string {
  return `/test/project-${++testCounter}`
}

describe('updateState', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('updates state via updater function', () => {
    const path = uniquePath()
    const newItem = {
      id: '1',
      type: 'issue' as const,
      title: 'Test',
      pinnedAt: Date.now(),
    }

    updateState(path, prev => ({ items: [...prev.items, newItem] }))

    expect(getSnapshot(path).items).toContainEqual(newItem)
  })

  it('persists state to localStorage', () => {
    const path = uniquePath()
    const newItem = {
      id: '1',
      type: 'doc' as const,
      title: 'My Doc',
      pinnedAt: 1000,
    }

    updateState(path, () => ({ items: [newItem] }))

    const stored = JSON.parse(
      localStorage.getItem(`centy-pinned-items-${path}`) || '{}'
    )
    expect(stored.items).toContainEqual(newItem)
  })

  it('notifies subscribed listeners', () => {
    const path = uniquePath()
    const listener = vi.fn()
    subscribe(path, listener)

    updateState(path, prev => prev)

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('notifies multiple listeners', () => {
    const path = uniquePath()
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    subscribe(path, listener1)
    subscribe(path, listener2)

    updateState(path, prev => prev)

    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(1)
  })

  it('does not notify listeners for different projectPath', () => {
    const path1 = uniquePath()
    const path2 = uniquePath()
    const listener = vi.fn()
    subscribe(path1, listener)

    updateState(path2, prev => prev)

    expect(listener).not.toHaveBeenCalled()
  })
})
