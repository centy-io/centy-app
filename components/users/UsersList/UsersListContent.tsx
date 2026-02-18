'use client'

import Link from 'next/link'
import { type RouteLiteral } from 'nextjs-routes'
import { UsersTable } from './UsersTable'
import { UsersListHeader } from './UsersListHeader'
import { UsersEmptyState } from './UsersEmptyState'
import { type User } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'

interface UsersListContentProps {
  projectPath: string
  isInitialized: boolean | null
  users: User[]
  loading: boolean
  error: string | null
  deleting: boolean
  showDeleteConfirm: string | null
  setShowDeleteConfirm: (id: string | null) => void
  handleDelete: (userId: string) => void
  fetchUsers: () => void
  setShowSyncModal: (show: boolean) => void
  newUserRoute: RouteLiteral | '/'
  getUserRoute: (userId: string) => RouteLiteral | '/'
  onContextMenu: (e: React.MouseEvent, user: User) => void
}

export function UsersListContent(props: UsersListContentProps) {
  const {
    projectPath,
    isInitialized,
    users,
    loading,
    error,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleDelete,
    newUserRoute,
    getUserRoute,
    onContextMenu,
  } = props

  return (
    <>
      <UsersListHeader {...props} />

      {!projectPath && (
        <div className="no-project-message">
          <p>Select a project from the header to view users</p>
        </div>
      )}

      {projectPath && isInitialized === false && (
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/">Initialize Project</Link>
        </div>
      )}

      {projectPath && isInitialized === true && (
        <>
          {error && <DaemonErrorMessage error={error} />}
          {showDeleteConfirm && (
            <DeleteConfirmDialog
              message="Are you sure you want to delete this user?"
              onCancel={() => setShowDeleteConfirm(null)}
              onConfirm={() => {
                handleDelete(showDeleteConfirm)
                setShowDeleteConfirm(null)
              }}
              deleting={deleting}
            />
          )}
          {loading && users.length === 0 ? (
            <div className="loading">Loading users...</div>
          ) : users.length === 0 ? (
            <UsersEmptyState
              newUserRoute={newUserRoute}
              onSync={() => props.setShowSyncModal(true)}
            />
          ) : (
            <UsersTable
              users={users}
              getUserRoute={getUserRoute}
              onContextMenu={onContextMenu}
            />
          )}
        </>
      )}
    </>
  )
}
