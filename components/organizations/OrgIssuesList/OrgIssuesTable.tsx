'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import type { GenericItem } from '@/gen/centy_pb'
import { getPriorityClass } from '@/components/shared/getPriorityClass'
import { getPriorityLabel } from '@/components/shared/getPriorityLabel'

interface OrgIssuesTableProps {
  orgSlug: string
  issues: GenericItem[]
}

export function OrgIssuesTable({ orgSlug, issues }: OrgIssuesTableProps) {
  return (
    <div className="org-issues-table-wrapper">
      <table className="org-issues-table">
        <thead className="org-issues-thead">
          <tr className="org-issues-header-row">
            <th className="org-issues-th">#</th>
            <th className="org-issues-th">Title</th>
            <th className="org-issues-th">Status</th>
            <th className="org-issues-th">Priority</th>
            <th className="org-issues-th">Created</th>
          </tr>
        </thead>
        <tbody className="org-issues-tbody">
          {issues.map(issue => {
            const meta = issue.metadata
            const cfOrgNum = meta
              ? parseInt(meta.customFields.org_display_number || '0', 10)
              : 0
            const orgNum = cfOrgNum || (meta ? meta.displayNumber : 0)
            const status = (meta && meta.status) || '—'
            const priority = meta ? meta.priority : 2
            const createdAt =
              meta && meta.createdAt
                ? new Date(meta.createdAt).toLocaleDateString()
                : '—'
            return (
              <tr key={issue.id} className="org-issue-row">
                <td className="org-issue-number">{orgNum}</td>
                <td className="org-issue-title-cell">
                  <Link
                    href={route({
                      pathname: '/organizations/[orgSlug]/issues/[issueId]',
                      query: { orgSlug, issueId: issue.id },
                    })}
                    className="org-issue-link"
                  >
                    {issue.title}
                  </Link>
                </td>
                <td className="org-issue-status-cell">
                  <span className="status-badge">{status}</span>
                </td>
                <td className="org-issue-priority-cell">
                  <span
                    className={`priority-badge ${getPriorityClass(getPriorityLabel(priority))}`}
                  >
                    {getPriorityLabel(priority) || 'Unknown'}
                  </span>
                </td>
                <td className="org-issue-date">{createdAt}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
