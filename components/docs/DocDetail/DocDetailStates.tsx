import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import type { Doc } from '@/gen/centy_pb'

interface DocDetailStatesProps {
  projectPath: string
  loading: boolean
  error: string | null
  doc: Doc | null
  docsListUrl: RouteLiteral
}

/**
 * Renders early-return states (no project, loading, error, not found).
 * Returns null when the main detail view should be rendered instead.
 */
export function DocDetailStates({
  projectPath,
  loading,
  error,
  doc,
  docsListUrl,
}: DocDetailStatesProps) {
  if (!projectPath) {
    return (
      <div className="doc-detail">
        <div className="error-message">
          No project path specified. Please go to the{' '}
          <Link href={docsListUrl}>documentation list</Link> and select a
          project.
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="doc-detail">
        <div className="loading">Loading document...</div>
      </div>
    )
  }

  if (error && !doc) {
    return (
      <div className="doc-detail">
        <DaemonErrorMessage error={error} />
        <Link href={docsListUrl} className="back-link">
          Back to Documentation
        </Link>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="doc-detail">
        <div className="error-message">Document not found</div>
        <Link href={docsListUrl} className="back-link">
          Back to Documentation
        </Link>
      </div>
    )
  }

  return null
}
