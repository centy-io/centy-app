'use client'

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import type { ContextMenuState } from './OrganizationsList.types'
import { getColumns } from './columns'
import { getInitialSortPreset } from './getInitialSortPreset'
import { useSortPreset } from './useSortPreset'
import type { Organization } from '@/gen/centy_pb'

export function useOrgListState() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const [showCascadeConfirm, setShowCascadeConfirm] = useState<string | null>(
    null
  )
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const initialPreset = useMemo(getInitialSortPreset, [])
  const { sortPreset, sorting, setSortPreset, setSorting } =
    useSortPreset(initialPreset)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
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

  return {
    organizations,
    setOrganizations,
    loading,
    setLoading,
    error,
    setError,
    deleting,
    setDeleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showCascadeConfirm,
    setShowCascadeConfirm,
    deleteError,
    setDeleteError,
    contextMenu,
    setContextMenu,
    sortPreset,
    setSortPreset,
    table,
  }
}
