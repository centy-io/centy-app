import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'

interface UsersListHeaderProps {
  projectPath: string | undefined
  isInitialized: boolean | null | undefined
  loading: boolean
  newUserRoute: RouteLiteral | '/'
  fetchUsers: () => void
  setShowSyncModal: (v: boolean) => void
}

export function UsersListHeader({
  projectPath,
  isInitialized,
  loading,
  newUserRoute,
  fetchUsers,
  setShowSyncModal,
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
