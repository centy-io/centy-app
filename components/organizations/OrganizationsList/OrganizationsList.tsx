'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { ContextMenu } from '@/components/shared/ContextMenu'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import type { Organization } from '@/gen/centy_pb'
import type { OrgContextMenuState } from './OrganizationsList.types'
import { createOrgColumns } from './columns'
import { useOrganizationsList } from './useOrganizationsList'
import { OrgsTable } from './OrgsTable'
import { buildOrgContextMenuItems } from './OrgContextMenuItems'
import { OrgDeleteConfirm } from './OrgDeleteConfirm'
import { OrgsListHeader } from './OrgsListHeader'
import { OrgsEmptyState } from './OrgsEmptyState'

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

  const contextMenuItems = buildOrgContextMenuItems(
    contextMenu,
    router,
    setContextMenu,
    hook.setShowDeleteConfirm
  )

  return (
    <div className="organizations-list">
      <OrgsListHeader
        loading={hook.loading}
        onRefresh={hook.fetchOrganizations}
      />
      {hook.error && <DaemonErrorMessage error={hook.error} />}
      {hook.showDeleteConfirm && (
        <OrgDeleteConfirm
          deleteError={hook.deleteError}
          deleting={hook.deleting}
          onCancel={() => {
            hook.setShowDeleteConfirm(null)
            hook.setDeleteError(null)
          }}
          onConfirm={() => hook.handleDelete(hook.showDeleteConfirm!)}
        />
      )}
      {hook.loading && hook.organizations.length === 0 ? (
        <div className="loading">Loading organizations...</div>
      ) : hook.organizations.length === 0 ? (
        <OrgsEmptyState />
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
