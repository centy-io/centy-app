'use client'

import type { ReactElement } from 'react'
import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'

interface IssuesHeaderProps {
  projectPath: string
  isInitialized: boolean | null
  loading: boolean
  fetchIssues: () => void
  onShowStandaloneModal: () => void
  createLink: (path: string) => RouteLiteral
}

export function IssuesHeader({
  projectPath,
  isInitialized,
  loading,
  fetchIssues,
  onShowStandaloneModal,
  createLink,
}: IssuesHeaderProps): ReactElement {
  return (
    <div className="issues-header">
      <h2 className="issues-title">Issues</h2>
      <div className="header-actions">
        {projectPath && isInitialized === true && (
          <button
            onClick={fetchIssues}
            disabled={loading}
            className="refresh-btn"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        )}
        <button
          onClick={onShowStandaloneModal}
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
