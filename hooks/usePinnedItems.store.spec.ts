import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  updateState,
} from './usePinnedItems.store'
import { DEFAULT_STATE } from './usePinnedItems.types'

// Use unique project path per test to avoid shared state
let testCounter = 0
function uniquePath(): string {
  return `/test/project-${++testCounter}`
}

describe('getServerSnapshot', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('returns DEFAULT_STATE', () => {
    expect(getServerSnapshot()).toEqual(DEFAULT_STATE)
  })
})

describe('getSnapshot', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('returns DEFAULT_STATE for new projectPath', () => {
    const path = uniquePath()
    expect(getSnapshot(path)).toEqual(DEFAULT_STATE)
  })

  it('returns persisted state from localStorage', () => {
    const path = uniquePath()
    const stored = {
      items: [{ id: '1', type: 'issue', title: 'Test', pinnedAt: 1000 }],
    }
    localStorage.setItem(`centy-pinned-items-${path}`, JSON.stringify(stored))

    expect(getSnapshot(path)).toEqual(stored)
  })

  it('returns DEFAULT_STATE when localStorage has invalid JSON', () => {
    const path = uniquePath()
    localStorage.setItem(`centy-pinned-items-${path}`, 'not-json')

    expect(getSnapshot(path)).toEqual(DEFAULT_STATE)
  })

  it('returns DEFAULT_STATE when localStorage items is not an array', () => {
    const path = uniquePath()
    localStorage.setItem(
      `centy-pinned-items-${path}`,
      JSON.stringify({ items: 'invalid' })
    )

    expect(getSnapshot(path)).toEqual(DEFAULT_STATE)
  })

  it('returns DEFAULT_STATE for empty projectPath', () => {
    expect(getSnapshot('')).toEqual(DEFAULT_STATE)
  })
})

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
      localStorage.getItem(`centy-pinned-items-${path}`)!
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

    // Pin item
    updateState(path, prev => ({ items: [...prev.items, item] }))
    expect(getSnapshot(path).items).toHaveLength(1)

    // Unpin item
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
