/* eslint-disable max-lines */
'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import type { ContextMenuState } from './OrganizationsList.types'
import { getColumns } from './columns'
import { centyClient } from '@/lib/grpc/client'
import {
  ListOrganizationsRequestSchema,
  DeleteOrganizationRequestSchema,
  type Organization,
} from '@/gen/centy_pb'
import type { ContextMenuItem } from '@/components/shared/ContextMenu'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

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

function buildOrgContextMenuItems(
  contextMenu: ContextMenuState | null,
  router: ReturnType<typeof useRouter>,
  setContextMenu: (v: ContextMenuState | null) => void,
  setShowDeleteConfirm: (v: string | null) => void
): ContextMenuItem[] {
  if (!contextMenu) return []
  const orgRoute = route({
    pathname: '/organizations/[orgSlug]',
    query: { orgSlug: contextMenu.org.slug },
  })
  return [
    {
      label: 'View',
      onClick: () => {
        router.push(orgRoute)
        setContextMenu(null)
      },
    },
    {
      label: 'Edit',
      onClick: () => {
        router.push(orgRoute)
        setContextMenu(null)
      },
    },
    {
      label: 'Delete',
      onClick: () => {
        setShowDeleteConfirm(contextMenu.org.slug)
        setContextMenu(null)
      },
      danger: true,
    },
  ]
}

export function useOrganizationsList() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
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

  const fetchOrganizations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await centyClient.listOrganizations(
        create(ListOrganizationsRequestSchema, {})
      )
      setOrganizations(response.organizations)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      setError(
        isDaemonUnimplemented(message)
          ? 'Organizations feature is not available. Please update your daemon.'
          : message
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  const handleDelete = useCallback(async (slug: string) => {
    setDeleting(true)
    setDeleteError(null)
    try {
      const response = await centyClient.deleteOrganization(
        create(DeleteOrganizationRequestSchema, { slug })
      )
      if (response.success) {
        setOrganizations(prev => prev.filter(o => o.slug !== slug))
        setShowDeleteConfirm(null)
      } else setDeleteError(response.error || 'Failed to delete organization')
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setDeleting(false)
    }
  }, [])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, org: Organization) => {
      e.preventDefault()
      setContextMenu({ x: e.clientX, y: e.clientY, org })
    },
    []
  )

  const contextMenuItems = buildOrgContextMenuItems(
    contextMenu,
    router,
    setContextMenu,
    setShowDeleteConfirm
  )

  return {
    organizations,
    loading,
    error,
    deleting,
    showDeleteConfirm,
    deleteError,
    contextMenu,
    contextMenuItems,
    table,
    sortPreset,
    setSortPreset,
    fetchOrganizations,
    handleDelete,
    handleContextMenu,
    setShowDeleteConfirm,
    setDeleteError,
    setContextMenu,
  }
}
