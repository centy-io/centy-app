'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import {
  ContextMenu,
  type ContextMenuItem,
} from '@/components/shared/ContextMenu'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import type { Organization } from '@/gen/centy_pb'
import type { OrgContextMenuState } from './OrganizationsList.types'
import { createOrgColumns } from './columns'
import { useOrganizationsList } from './useOrganizationsList'
import { OrgsTable } from './OrgsTable'

export function OrganizationsList() {
  const router = useRouter()
  const hook = useOrganizationsList()
  const [contextMenu, setContextMenu] = useState<OrgContextMenuState | null>(
    null
  )
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const columns = useMemo(() => createOrgColumns(), [])

  const table = useReactTable({
    data: hook.organizations,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

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
            hook.setShowDeleteConfirm(contextMenu.org.slug)
            setContextMenu(null)
          },
          danger: true,
        },
      ]
    : []

  return (
    <div className="organizations-list">
      <div className="organizations-header">
        <h2>Organizations</h2>
        <div className="header-actions">
          <button
            onClick={hook.fetchOrganizations}
            disabled={hook.loading}
            className="refresh-btn"
          >
            {hook.loading ? 'Loading...' : 'Refresh'}
          </button>
          <Link href="/organizations/new" className="create-btn">
            + New Organization
          </Link>
        </div>
      </div>
      {hook.error && <DaemonErrorMessage error={hook.error} />}
      {hook.showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Are you sure you want to delete this organization?</p>
          {hook.deleteError && (
            <p className="delete-error-message">{hook.deleteError}</p>
          )}
          <div className="delete-confirm-actions">
            <button
              onClick={() => {
                hook.setShowDeleteConfirm(null)
                hook.setDeleteError(null)
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              onClick={() => hook.handleDelete(hook.showDeleteConfirm!)}
              disabled={hook.deleting}
              className="confirm-delete-btn"
            >
              {hook.deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      )}
      {hook.loading && hook.organizations.length === 0 ? (
        <div className="loading">Loading organizations...</div>
      ) : hook.organizations.length === 0 ? (
        <div className="empty-state">
          <p>No organizations found</p>
          <p>
            <Link href="/organizations/new">
              Create your first organization
            </Link>{' '}
            to group your projects
          </p>
        </div>
      ) : (
        <OrgsTable table={table} onContextMenu={handleContextMenu} />
      )}
      {contextMenu && (
        <ContextMenu
          items={contextMenuItems}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}
