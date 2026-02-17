import type { PinnedItemsState } from './usePinnedItems.types'
import { STORAGE_KEY_PREFIX, DEFAULT_STATE } from './usePinnedItems.types'

function getStorageKey(projectPath: string): string {
  return `${STORAGE_KEY_PREFIX}-${projectPath}`
}

function loadState(projectPath: string): PinnedItemsState {
  if (typeof window === 'undefined' || !projectPath) return DEFAULT_STATE
  try {
    const stored = localStorage.getItem(getStorageKey(projectPath))
    if (!stored) return DEFAULT_STATE
    const parsed = JSON.parse(stored) as PinnedItemsState
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
    }
  } catch {
    return DEFAULT_STATE
  }
}

function saveState(projectPath: string, state: PinnedItemsState): void {
  if (typeof window === 'undefined' || !projectPath) return
  try {
    localStorage.setItem(getStorageKey(projectPath), JSON.stringify(state))
  } catch {
    // Ignore storage errors
  }
}

// Create a store for each project path
const stores = new Map<
  string,
  {
    state: PinnedItemsState
    listeners: Set<() => void>
  }
>()

function getOrCreateStore(projectPath: string) {
  if (!stores.has(projectPath)) {
    stores.set(projectPath, {
      state: loadState(projectPath),
      listeners: new Set(),
    })
  }
  return stores.get(projectPath)!
}

export function subscribe(projectPath: string, listener: () => void) {
  const store = getOrCreateStore(projectPath)
  store.listeners.add(listener)
  return () => store.listeners.delete(listener)
}

export function getSnapshot(projectPath: string): PinnedItemsState {
  return getOrCreateStore(projectPath).state
}

export function getServerSnapshot(): PinnedItemsState {
  return DEFAULT_STATE
}

export function updateState(
  projectPath: string,
  updater: (prev: PinnedItemsState) => PinnedItemsState
) {
  const store = getOrCreateStore(projectPath)
  store.state = updater(store.state)
  saveState(projectPath, store.state)
  store.listeners.forEach(listener => listener())
}
