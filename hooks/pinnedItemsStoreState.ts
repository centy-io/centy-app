import type { PinnedItemsState } from './usePinnedItems.types'
import { DEFAULT_STATE } from './usePinnedItems.types'

const STORAGE_KEY_PREFIX = 'centy-pinned-items'

function getStorageKey(projectPath: string): string {
  return `${STORAGE_KEY_PREFIX}-${projectPath}`
}

function loadFromStorage(projectPath: string): PinnedItemsState {
  if (typeof window === 'undefined' || !projectPath) return DEFAULT_STATE
  try {
    const stored = localStorage.getItem(getStorageKey(projectPath))
    if (!stored) return DEFAULT_STATE
    const parsed: PinnedItemsState = JSON.parse(stored)
    return {
      items: Array.isArray(parsed.items) ? parsed.items : DEFAULT_STATE.items,
    }
  } catch {
    return DEFAULT_STATE
  }
}

interface StoreEntry {
  state: PinnedItemsState
  listeners: Set<() => void>
}

const storeMap = new Map<string, StoreEntry>()

export const pinnedItemsStoreState = {
  getOrCreate(projectPath: string): StoreEntry {
    let entry = storeMap.get(projectPath)
    if (!entry) {
      entry = { state: loadFromStorage(projectPath), listeners: new Set() }
      storeMap.set(projectPath, entry)
    }
    return entry
  },
  save(projectPath: string, state: PinnedItemsState): void {
    if (typeof window === 'undefined' || !projectPath) return
    try {
      localStorage.setItem(getStorageKey(projectPath), JSON.stringify(state))
    } catch {
      // Ignore storage errors
    }
  },
}
