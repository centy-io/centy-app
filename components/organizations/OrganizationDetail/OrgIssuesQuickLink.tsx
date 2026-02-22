'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'

interface OrgIssuesQuickLinkProps {
  orgSlug: string
}

export function OrgIssuesQuickLink({ orgSlug }: OrgIssuesQuickLinkProps) {
  return (
    <div className="org-issues-section">
      <div className="org-issues-section-header">
        <h3 className="org-projects-title">Org Issues</h3>
        <Link
          href={route({
            pathname: '/organizations/[orgSlug]/issues',
            query: { orgSlug },
          })}
          className="org-issues-link"
        >
          View all issues →
        </Link>
      </div>
      <p className="org-issues-description">
        Organization-level issues that apply across all projects.
      </p>
    </div>
  )
}
