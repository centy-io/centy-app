import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'

interface DocsListHeaderProps {
  projectPath: string
  isInitialized: boolean | null
  loading: boolean
  onRefresh: () => void
  createNewUrl: RouteLiteral
}

export function DocsListHeader({
  projectPath,
  isInitialized,
  loading,
  onRefresh,
  createNewUrl,
}: DocsListHeaderProps) {
  return (
    <div className="docs-header">
      <h2>Documentation</h2>
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
        <Link href={createNewUrl} className="create-btn">
          + New Doc
        </Link>
      </div>
    </div>
  )
}
