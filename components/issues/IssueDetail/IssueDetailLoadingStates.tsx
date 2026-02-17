import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface LoadingStatesResult {
  element: React.ReactElement | null
}

interface LoadingStatesParams {
  projectPath: string
  pathLoading: boolean
  loading: boolean
  error: string | null
  hasIssue: boolean
  issuesListUrl: RouteLiteral
}

export function getLoadingState({
  projectPath,
  pathLoading,
  loading,
  error,
  hasIssue,
  issuesListUrl,
}: LoadingStatesParams): LoadingStatesResult {
  if (!projectPath) {
    return {
      element: (
        <div className="issue-detail">
          <DaemonErrorMessage error="No project path specified. Please go to the issues list and select a project." />
        </div>
      ),
    }
  }
  if (pathLoading || loading) {
    return {
      element: (
        <div className="issue-detail">
          <div className="loading">Loading issue...</div>
        </div>
      ),
    }
  }
  if (error && !hasIssue) {
    return {
      element: (
        <div className="issue-detail">
          <DaemonErrorMessage error={error} />
          <Link href={issuesListUrl} className="back-link">
            Back to Issues
          </Link>
        </div>
      ),
    }
  }
  if (!hasIssue) {
    return {
      element: (
        <div className="issue-detail">
          <div className="error-message">Issue not found</div>
          <Link href={issuesListUrl} className="back-link">
            Back to Issues
          </Link>
        </div>
      ),
    }
  }
  return { element: null }
}
