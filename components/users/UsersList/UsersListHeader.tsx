'use client'

import Link from 'next/link'
import { type RouteLiteral } from 'nextjs-routes'

interface UsersListHeaderProps {
  projectPath: string
  isInitialized: boolean | null
  loading: boolean
  fetchUsers: () => void
  setShowSyncModal: (show: boolean) => void
  newUserRoute: RouteLiteral | '/'
}

export function UsersListHeader({
  projectPath,
  isInitialized,
  loading,
  fetchUsers,
  setShowSyncModal,
  newUserRoute,
}: UsersListHeaderProps) {
  return (
    <div className="users-header">
      <h2>Users</h2>
      <div className="header-actions">
        {projectPath && isInitialized === true && (
          <>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="refresh-btn"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <button onClick={() => setShowSyncModal(true)} className="sync-btn">
              Sync from Git
            </button>
          </>
        )}
        <Link href={newUserRoute} className="create-btn">
          + New User
        </Link>
      </div>
    </div>
  )
}
