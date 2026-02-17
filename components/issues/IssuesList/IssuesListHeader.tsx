import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'

interface IssuesListHeaderProps {
  projectPath: string
  isInitialized: boolean | null
  loading: boolean
  createLink: (path: string) => RouteLiteral
  onRefresh: () => void
  onNewWorkspace: () => void
}

export function IssuesListHeader({
  projectPath,
  isInitialized,
  loading,
  createLink,
  onRefresh,
  onNewWorkspace,
}: IssuesListHeaderProps) {
  return (
    <div className="issues-header">
      <h2>Issues</h2>
      <div className="header-actions">
        {projectPath && isInitialized === true && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="refresh-btn"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        )}
        <button
          onClick={onNewWorkspace}
          className="workspace-btn"
          title="Create a standalone workspace without an issue"
        >
          + New Workspace
        </button>
        <Link href={createLink('/issues/new')} className="create-btn">
          + New Issue
        </Link>
      </div>
    </div>
  )
}
