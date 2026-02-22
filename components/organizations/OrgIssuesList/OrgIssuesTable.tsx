'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import type { Issue } from '@/gen/centy_pb'

function priorityLabel(priority: number): string {
  if (priority === 1) return 'High'
  if (priority === 2) return 'Medium'
  return 'Low'
}

function priorityClass(priority: number): string {
  if (priority === 1) return 'priority-high'
  if (priority === 2) return 'priority-medium'
  return 'priority-low'
}

interface OrgIssuesTableProps {
  orgSlug: string
  issues: Issue[]
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
            const orgNum = meta ? meta.orgDisplayNumber : issue.displayNumber
            const status = (meta && meta.status) || '—'
            const priority = meta ? meta.priority : 2
            const createdAt = meta && meta.createdAt
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
                  <span className={`priority-badge ${priorityClass(priority)}`}>
                    {priorityLabel(priority)}
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
