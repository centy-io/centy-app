'use client'

import { useCallback } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import type { PinnedItem, PinnedItemsState } from './usePinnedItems.types'
import { DEFAULT_STATE } from './usePinnedItems.types'
import { usePathContext } from '@/components/providers/PathContextProvider'

export type { PinnedItem } from './usePinnedItems.types'

const STORAGE_KEY_PREFIX = 'centy-pinned-items'

function toPinnedItemArray(val: unknown): PinnedItem[] {
  if (!Array.isArray(val)) return []
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return val
}

// Stable options: usehooks-ts memoizes its (de)serializers on this object.
// initializeWithValue: false keeps the first client render equal to the static export.
const STORAGE_OPTIONS = {
  initializeWithValue: false,
  deserializer: (raw: string): PinnedItemsState => {
    try {
      const parsed: unknown = JSON.parse(raw)
      const items =
        typeof parsed === 'object' && parsed !== null && 'items' in parsed
          ? parsed.items
          : undefined
      return { items: toPinnedItemArray(items) }
    } catch {
      return DEFAULT_STATE
    }
  },
}

export function usePinnedItems() {
  const { projectPath } = usePathContext()
  const [state, setState] = useLocalStorage<PinnedItemsState>(
    `${STORAGE_KEY_PREFIX}-${projectPath}`,
    DEFAULT_STATE,
    STORAGE_OPTIONS
  )

  const pinItem = useCallback(
    (item: Omit<PinnedItem, 'pinnedAt'>) => {
      setState(prev => {
        if (prev.items.some(existing => existing.id === item.id)) {
          return prev
        }
        return {
          items: [...prev.items, { ...item, pinnedAt: Date.now() }],
        }
      })
    },
    [setState]
  )

  const unpinItem = useCallback(
    (id: string) => {
      setState(prev => ({
        items: prev.items.filter(item => item.id !== id),
      }))
    },
    [setState]
  )

  const isPinned = useCallback(
    (id: string) => {
      return state.items.some(item => item.id === id)
    },
    [state.items]
  )

  const reorderItems = useCallback(
    (fromIndex: number, toIndex: number) => {
      setState(prev => {
        const newItems = [...prev.items]
        const [removed] = newItems.splice(fromIndex, 1)
        newItems.splice(toIndex, 0, removed)
        return { items: newItems }
      })
    },
    [setState]
  )

  return {
    pinnedItems: state.items,
    pinItem,
    unpinItem,
    isPinned,
    reorderItems,
  }
}
