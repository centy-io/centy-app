'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table'
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  updateSettings,
} from './useIssueTableSettings.store'

const AGGREGATE_KEY = '__aggregate__'

export function useAggregateTableSettings() {
  const settings = useSyncExternalStore(
    useCallback(listener => subscribe(AGGREGATE_KEY, listener), []),
    useCallback(() => getSnapshot(AGGREGATE_KEY), []),
    getServerSnapshot
  )

  const setSorting = useCallback(
    (value: SortingState | ((prev: SortingState) => SortingState)) => {
      updateSettings(AGGREGATE_KEY, prev => ({
        ...prev,
        sorting: typeof value === 'function' ? value(prev.sorting) : value,
      }))
    },
    []
  )

  const setColumnFilters = useCallback(
    (
      value:
        | ColumnFiltersState
        | ((prev: ColumnFiltersState) => ColumnFiltersState)
    ) => {
      updateSettings(AGGREGATE_KEY, prev => ({
        ...prev,
        columnFilters:
          typeof value === 'function' ? value(prev.columnFilters) : value,
      }))
    },
    []
  )

  return {
    sorting: settings.sorting,
    setSorting,
    columnFilters: settings.columnFilters,
    setColumnFilters,
  }
}
