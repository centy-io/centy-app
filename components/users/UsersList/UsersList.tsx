'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { route, type RouteLiteral } from 'nextjs-routes'
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
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { createUsersColumns } from './columns'
import { useUsersList } from './useUsersList'
import { useUsersContextMenu } from './useUsersContextMenu'
import { UsersTable } from './UsersTable'

export function UsersList() {
  const params = useParams()
  const hook = useUsersList()
  const projectContext = useMemo(() => {
    const org = params?.organization as string | undefined
    const project = params?.project as string | undefined
    return org && project ? { organization: org, project } : null
  }, [params])
  const getUserRoute = useCallback(
    (userId: string): RouteLiteral | '/' => {
      if (!projectContext) return '/'
      return route({
        pathname: '/[organization]/[project]/users/[userId]',
        query: { ...projectContext, userId },
      })
    },
    [projectContext]
  )
  const newUserRoute: RouteLiteral | '/' = useMemo(() => {
    if (!projectContext) return '/'
    return route({
      pathname: '/[organization]/[project]/users/new',
      query: projectContext,
    })
  }, [projectContext])

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
      <div className="users-header">
        <h2>Users</h2>
        <div className="header-actions">
          {hook.projectPath && hook.isInitialized === true && (
            <>
              <button
                onClick={hook.fetchUsers}
                disabled={hook.loading}
                className="refresh-btn"
              >
                {hook.loading ? 'Loading...' : 'Refresh'}
              </button>
              <button
                onClick={() => hook.setShowSyncModal(true)}
                className="sync-btn"
              >
                Sync from Git
              </button>
            </>
          )}
          <Link href={newUserRoute} className="create-btn">
            + New User
          </Link>
        </div>
      </div>
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
        <>
          {hook.error && <DaemonErrorMessage error={hook.error} />}
          {hook.showDeleteConfirm && (
            <div className="delete-confirm">
              <p>Are you sure you want to delete this user?</p>
              <div className="delete-confirm-actions">
                <button
                  onClick={() => hook.setShowDeleteConfirm(null)}
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
          {hook.loading && hook.users.length === 0 ? (
            <div className="loading">Loading users...</div>
          ) : hook.users.length === 0 ? (
            <div className="empty-state">
              <p>No users found</p>
              <p>
                <Link href={newUserRoute}>Create your first user</Link> or{' '}
                <button
                  onClick={() => hook.setShowSyncModal(true)}
                  className="sync-link-btn"
                >
                  sync from git history
                </button>
              </p>
            </div>
          ) : (
            <UsersTable table={table} onContextMenu={handleContextMenu} />
          )}
        </>
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
