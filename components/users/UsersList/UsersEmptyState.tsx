'use client'

import Link from 'next/link'
import { type RouteLiteral } from 'nextjs-routes'

interface UsersEmptyStateProps {
  newUserRoute: RouteLiteral | '/'
  onSync: () => void
}

export function UsersEmptyState({
  newUserRoute,
  onSync,
}: UsersEmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-state-text">No users found</p>
      <p className="empty-state-hint">
        <Link href={newUserRoute}>Create your first user</Link> or{' '}
        <button onClick={onSync} className="sync-link-btn">
          sync from git history
        </button>
      </p>
    </div>
  )
}
