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
