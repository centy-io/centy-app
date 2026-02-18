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
import { centyClient } from '@/lib/grpc/client'
import {
  ListOrganizationsRequestSchema,
  DeleteOrganizationRequestSchema,
  type Organization,
} from '@/gen/centy_pb'
import type { ContextMenuItem } from '@/components/shared/ContextMenu'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import type { ContextMenuState } from './OrganizationsList.types'
import { getColumns } from './columns'

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
  const [sorting, setSorting] = useState<SortingState>([])
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

  const fetchOrganizations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const request = create(ListOrganizationsRequestSchema, {})
      const response = await centyClient.listOrganizations(request)
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
      const request = create(DeleteOrganizationRequestSchema, { slug })
      const response = await centyClient.deleteOrganization(request)
      if (response.success) {
        setOrganizations(prev => prev.filter(o => o.slug !== slug))
        setShowDeleteConfirm(null)
      } else {
        setDeleteError(response.error || 'Failed to delete organization')
      }
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

  const contextMenuItems: ContextMenuItem[] = contextMenu
    ? [
        {
          label: 'View',
          onClick: () => {
            router.push(
              route({
                pathname: '/organizations/[orgSlug]',
                query: { orgSlug: contextMenu.org.slug },
              })
            )
            setContextMenu(null)
          },
        },
        {
          label: 'Edit',
          onClick: () => {
            router.push(
              route({
                pathname: '/organizations/[orgSlug]',
                query: { orgSlug: contextMenu.org.slug },
              })
            )
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
    : []

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
    fetchOrganizations,
    handleDelete,
    handleContextMenu,
    setShowDeleteConfirm,
    setDeleteError,
    setContextMenu,
  }
}
