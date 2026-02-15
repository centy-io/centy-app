'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { usePathContext } from '@/components/providers/PathContextProvider'

const STORAGE_KEY_PREFIX = 'centy-pinned-items'

export interface PinnedItem {
  id: string
  type: 'issue' | 'doc' | 'pr'
  title: string
  displayNumber?: number
  pinnedAt: number
}

interface PinnedItemsState {
  items: PinnedItem[]
}

const DEFAULT_STATE: PinnedItemsState = {
  items: [],
}

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

function subscribe(projectPath: string, listener: () => void) {
  const store = getOrCreateStore(projectPath)
  store.listeners.add(listener)
  return () => store.listeners.delete(listener)
}

function getSnapshot(projectPath: string): PinnedItemsState {
  return getOrCreateStore(projectPath).state
}

function getServerSnapshot(): PinnedItemsState {
  return DEFAULT_STATE
}

function updateState(
  projectPath: string,
  updater: (prev: PinnedItemsState) => PinnedItemsState
) {
  const store = getOrCreateStore(projectPath)
  store.state = updater(store.state)
  saveState(projectPath, store.state)
  store.listeners.forEach(listener => listener())
}

export function usePinnedItems() {
  const { projectPath } = usePathContext()

  const state = useSyncExternalStore(
    useCallback(listener => subscribe(projectPath, listener), [projectPath]),
    useCallback(() => getSnapshot(projectPath), [projectPath]),
    getServerSnapshot
  )

  const pinItem = useCallback(
    (item: Omit<PinnedItem, 'pinnedAt'>) => {
      updateState(projectPath, prev => {
        if (prev.items.some(existing => existing.id === item.id)) {
          return prev
        }
        return {
          items: [...prev.items, { ...item, pinnedAt: Date.now() }],
        }
      })
    },
    [projectPath]
  )

  const unpinItem = useCallback(
    (id: string) => {
      updateState(projectPath, prev => ({
        items: prev.items.filter(item => item.id !== id),
      }))
    },
    [projectPath]
  )

  const isPinned = useCallback(
    (id: string) => {
      return state.items.some(item => item.id === id)
    },
    [state.items]
  )

  const reorderItems = useCallback(
    (fromIndex: number, toIndex: number) => {
      updateState(projectPath, prev => {
        const newItems = [...prev.items]
        const [removed] = newItems.splice(fromIndex, 1)
        newItems.splice(toIndex, 0, removed)
        return { items: newItems }
      })
    },
    [projectPath]
  )

  return {
    pinnedItems: state.items,
    pinItem,
    unpinItem,
    isPinned,
    reorderItems,
  }
}
