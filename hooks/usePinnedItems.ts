'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { usePathContext } from '@/components/providers/PathContextProvider'
import type { PinnedItem } from './usePinnedItems.types'
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  updateState,
} from './usePinnedItems.store'

export type { PinnedItem } from './usePinnedItems.types'

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
