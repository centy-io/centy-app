'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { getColumns } from './columns'
import type { Organization } from '@/gen/centy_pb'

type SortPreset = 'name-asc' | 'name-desc' | 'projects-desc' | 'projects-asc'

const SORT_SESSION_KEY = 'centy-orgs-sort'

function isSortPreset(value: string): value is SortPreset {
  return (
    value === 'name-asc' ||
    value === 'name-desc' ||
    value === 'projects-desc' ||
    value === 'projects-asc'
  )
}

function getSortingForPreset(preset: SortPreset): SortingState {
  if (preset === 'name-asc') return [{ id: 'name', desc: false }]
  if (preset === 'name-desc') return [{ id: 'name', desc: true }]
  if (preset === 'projects-desc') return [{ id: 'projectCount', desc: true }]
  return [{ id: 'projectCount', desc: false }]
}

function getInitialSortPreset(): SortPreset {
  try {
    const stored = sessionStorage.getItem(SORT_SESSION_KEY)
    if (stored !== null && isSortPreset(stored)) return stored
  } catch {
    // ignore
  }
  return 'name-asc'
}

export function useOrgTable(organizations: Organization[]) {
  const initialPreset = useMemo(getInitialSortPreset, [])
  const [sortPreset, setSortPresetState] = useState<SortPreset>(initialPreset)
  const [sorting, setSorting] = useState<SortingState>(
    getSortingForPreset(initialPreset)
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

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

  const columns = useMemo(() => getColumns(), [])
  const table = useReactTable({
    data: organizations,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return { sortPreset, setSortPreset, table }
}
