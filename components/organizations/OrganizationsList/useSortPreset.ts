'use client'

import { useState, useCallback } from 'react'
import type { SortingState } from '@tanstack/react-table'
import type { SortPreset } from './SortPreset'
import { SORT_SESSION_KEY } from './SORT_SESSION_KEY'
import { isSortPreset } from './isSortPreset'
import { getSortingForPreset } from './getSortingForPreset'

export function useSortPreset(initialPreset: SortPreset): {
  sortPreset: SortPreset
  sorting: SortingState
  setSortPreset: (raw: string) => void
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
} {
  const [sortPreset, setSortPresetState] = useState<SortPreset>(initialPreset)
  const [sorting, setSorting] = useState<SortingState>(
    getSortingForPreset(initialPreset)
  )
  const setSortPreset = useCallback((raw: string) => {
    if (!isSortPreset(raw)) return
    setSortPresetState(raw)
    setSorting(getSortingForPreset(raw))
    try {
      sessionStorage.setItem(SORT_SESSION_KEY, raw)
    } catch {
      /* ignore */
    }
  }, [])
  return { sortPreset, sorting, setSortPreset, setSorting }
}
