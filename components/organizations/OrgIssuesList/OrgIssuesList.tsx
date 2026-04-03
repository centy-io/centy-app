'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import type { OrgIssuesListProps } from './OrgIssuesList.types'
import { useOrgIssues } from './hooks/useOrgIssues'
import { OrgIssuesTable } from './OrgIssuesTable'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function OrgIssuesList({ orgSlug }: OrgIssuesListProps) {
  const { issues, loading, error, orgProjectPath, fetchIssues } =
    useOrgIssues(orgSlug)

  return (
    <div className="org-issues-list">
      <div className="org-issues-header">
        <div className="org-issues-header-left">
          <Link
            href={route({
              pathname: '/organizations/[orgSlug]',
              query: { orgSlug },
            })}
            className="back-link"
          >
            ← Back to Organization
          </Link>
          <h2 className="org-issues-title">Org Issues</h2>
        </div>
        <div className="header-actions">
          <button
            onClick={() => {
              void fetchIssues()
            }}
            disabled={loading}
            className="refresh-btn"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          {orgProjectPath && (
            <Link
              href={route({
                pathname: '/organizations/[orgSlug]/issues/new',
                query: { orgSlug },
              })}
              className="create-btn"
            >
              + New Org Issue
            </Link>
          )}
        </div>
      </div>

      <p className="org-issues-note">
        Organization-level issues are shared across all projects in this
        organization.
      </p>

      {error && <DaemonErrorMessage error={error} />}

      {loading && issues.length === 0 ? (
        <div className="loading">Loading issues...</div>
      ) : issues.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">
            {orgProjectPath
              ? 'No org-level issues yet. Create the first one!'
              : 'No org-level issues yet.'}
          </p>
        </div>
      ) : (
        <OrgIssuesTable orgSlug={orgSlug} issues={issues} />
      )}
    </div>
  )
}
