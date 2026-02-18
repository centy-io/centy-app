'use client'

import type { ReactElement } from 'react'
import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import type { Issue } from '@/gen/centy_pb'

interface LoadingCheckProps {
  projectPath: string
  pathLoading: boolean
  loading: boolean
  error: string | null
  issue: Issue | null
  issuesListUrl: RouteLiteral
}

/**
 * Returns a ReactElement if we should show a loading/error state,
 * or null if we should proceed to the full detail view.
 */
export function renderLoadingState({
  projectPath,
  pathLoading,
  loading,
  error,
  issue,
  issuesListUrl,
}: LoadingCheckProps): ReactElement | null {
  if (!projectPath) {
    return (
      <div className="issue-detail">
        <DaemonErrorMessage error="No project path specified. Please go to the issues list and select a project." />
      </div>
    )
  }
  if (pathLoading || loading) {
    return (
      <div className="issue-detail">
        <div className="loading">Loading issue...</div>
      </div>
    )
  }
  if (error && !issue) {
    return (
      <div className="issue-detail">
        <DaemonErrorMessage error={error} />
        <Link href={issuesListUrl} className="back-link">
          Back to Issues
        </Link>
      </div>
    )
  }
  if (!issue) {
    return (
      <div className="issue-detail">
        <div className="error-message">Issue not found</div>
        <Link href={issuesListUrl} className="back-link">
          Back to Issues
        </Link>
      </div>
    )
  }
  return null
}
