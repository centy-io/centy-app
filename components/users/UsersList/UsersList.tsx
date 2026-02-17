'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { SyncUsersModal } from '../SyncUsersModal'
import { ContextMenu } from '@/components/shared/ContextMenu'
import { createUsersColumns } from './columns'
import { useUsersList } from './useUsersList'
import { useUsersContextMenu } from './useUsersContextMenu'
import { useUsersRoutes } from './useUsersRoutes'
import { UsersListHeader } from './UsersListHeader'
import { UsersListContent } from './UsersListContent'

export function UsersList() {
  const hook = useUsersList()
  const { getUserRoute, newUserRoute } = useUsersRoutes()

  const { contextMenu, contextMenuItems, handleContextMenu, closeContextMenu } =
    useUsersContextMenu(getUserRoute, hook.setShowDeleteConfirm)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const columns = useMemo(() => createUsersColumns(), [])

  const table = useReactTable({
    data: hook.users,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: { getUserRoute },
  })

  const handleSynced = useCallback(
    (createdCount: number) => {
      if (createdCount > 0) hook.fetchUsers()
      hook.setShowSyncModal(false)
    },
    [hook]
  )

  return (
    <div className="users-list">
      <UsersListHeader
        projectPath={hook.projectPath}
        isInitialized={hook.isInitialized}
        loading={hook.loading}
        newUserRoute={newUserRoute}
        fetchUsers={hook.fetchUsers}
        setShowSyncModal={hook.setShowSyncModal}
      />
      {!hook.projectPath && (
        <div className="no-project-message">
          <p>Select a project from the header to view users</p>
        </div>
      )}
      {hook.projectPath && hook.isInitialized === false && (
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/">Initialize Project</Link>
        </div>
      )}
      {hook.projectPath && hook.isInitialized === true && (
        <UsersListContent
          error={hook.error}
          showDeleteConfirm={hook.showDeleteConfirm}
          deleting={hook.deleting}
          loading={hook.loading}
          users={hook.users}
          newUserRoute={newUserRoute}
          table={table}
          setShowDeleteConfirm={hook.setShowDeleteConfirm}
          handleDelete={hook.handleDelete}
          setShowSyncModal={hook.setShowSyncModal}
          handleContextMenu={handleContextMenu}
        />
      )}
      {contextMenu && (
        <ContextMenu
          items={contextMenuItems}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
        />
      )}
      {hook.showSyncModal && (
        <SyncUsersModal
          onClose={() => hook.setShowSyncModal(false)}
          onSynced={handleSynced}
        />
      )}
    </div>
  )
}
