import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import type { User } from '@/gen/centy_pb'
import type { Table } from '@tanstack/react-table'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { UsersTable } from './UsersTable'

interface UsersListContentProps {
  error: string | null
  showDeleteConfirm: string | null
  deleting: boolean
  loading: boolean
  users: User[]
  newUserRoute: RouteLiteral | '/'
  table: Table<User>
  setShowDeleteConfirm: (v: string | null) => void
  handleDelete: (id: string) => void
  setShowSyncModal: (v: boolean) => void
  handleContextMenu: (e: React.MouseEvent, row: User) => void
}

export function UsersListContent(props: UsersListContentProps) {
  return (
    <>
      {props.error && <DaemonErrorMessage error={props.error} />}
      {props.showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Are you sure you want to delete this user?</p>
          <div className="delete-confirm-actions">
            <button
              onClick={() => props.setShowDeleteConfirm(null)}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              onClick={() => props.handleDelete(props.showDeleteConfirm!)}
              disabled={props.deleting}
              className="confirm-delete-btn"
            >
              {props.deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      )}
      {props.loading && props.users.length === 0 ? (
        <div className="loading">Loading users...</div>
      ) : props.users.length === 0 ? (
        <div className="empty-state">
          <p>No users found</p>
          <p>
            <Link href={props.newUserRoute}>Create your first user</Link> or{' '}
            <button
              onClick={() => props.setShowSyncModal(true)}
              className="sync-link-btn"
            >
              sync from git history
            </button>
          </p>
        </div>
      ) : (
        <UsersTable
          table={props.table}
          onContextMenu={props.handleContextMenu}
        />
      )}
    </>
  )
}
