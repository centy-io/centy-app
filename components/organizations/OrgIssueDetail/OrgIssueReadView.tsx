'use client'

import type { Issue } from '@/gen/centy_pb'
import { TextEditor } from '@/components/shared/TextEditor'

function priorityLabel(priority: number): string {
  if (priority === 1) return 'High'
  if (priority === 2) return 'Medium'
  return 'Low'
}

interface OrgIssueReadViewProps {
  issue: Issue
}

export function OrgIssueReadView({ issue }: OrgIssueReadViewProps) {
  const meta = issue.metadata
  const displayNum = meta ? meta.orgDisplayNumber : issue.displayNumber
  const status = (meta && meta.status) || '—'
  const priority = meta ? meta.priority : 2
  const createdAt =
    meta && meta.createdAt ? new Date(meta.createdAt).toLocaleString() : null
  const updatedAt =
    meta && meta.updatedAt ? new Date(meta.updatedAt).toLocaleString() : null

  return (
    <>
      <div className="issue-detail-meta">
        <span className="org-issue-badge">Org Issue #{displayNum}</span>
        <span className="status-badge">{status}</span>
        <span className="priority-badge">{priorityLabel(priority)}</span>
      </div>
      <h1 className="issue-title">{issue.title}</h1>
      <div className="issue-body">
        <TextEditor
          value={issue.description}
          onChange={() => undefined}
          format="md"
          mode="display"
        />
      </div>
      {(createdAt || updatedAt) && (
        <div className="issue-timestamps">
          {createdAt && <span className="timestamp">Created: {createdAt}</span>}
          {updatedAt && <span className="timestamp">Updated: {updatedAt}</span>}
        </div>
      )}
    </>
  )
}
