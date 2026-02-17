'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table'
import { useProject } from '@/components/providers/ProjectProvider'
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  updateSettings,
} from './useIssueTableSettings.store'

export function useIssueTableSettings() {
  const { projectPath } = useProject()

  const settings = useSyncExternalStore(
    useCallback(listener => subscribe(projectPath, listener), [projectPath]),
    useCallback(() => getSnapshot(projectPath), [projectPath]),
    getServerSnapshot
  )

  const setSorting = useCallback(
    (value: SortingState | ((prev: SortingState) => SortingState)) => {
      updateSettings(projectPath, prev => ({
        ...prev,
        sorting: typeof value === 'function' ? value(prev.sorting) : value,
      }))
    },
    [projectPath]
  )

  const setColumnFilters = useCallback(
    (
      value:
        | ColumnFiltersState
        | ((prev: ColumnFiltersState) => ColumnFiltersState)
    ) => {
      updateSettings(projectPath, prev => ({
        ...prev,
        columnFilters:
          typeof value === 'function' ? value(prev.columnFilters) : value,
      }))
    },
    [projectPath]
  )

  return {
    sorting: settings.sorting,
    setSorting,
    columnFilters: settings.columnFilters,
    setColumnFilters,
  }
}
