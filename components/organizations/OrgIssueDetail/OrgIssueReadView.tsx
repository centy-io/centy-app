'use client'

import type { Issue } from '@/gen/centy_pb'
import { TextEditor } from '@/components/shared/TextEditor'
import { ItemMetadata } from '@/components/shared/ItemMetadata'

interface OrgIssueReadViewProps {
  issue: Issue
}

export function OrgIssueReadView({ issue }: OrgIssueReadViewProps) {
  const meta = issue.metadata
  const displayNum = meta ? meta.orgDisplayNumber : issue.displayNumber
  const status = (meta && meta.status) || undefined
  const priority = meta ? meta.priority : undefined

  return (
    <>
      <h1 className="issue-title">{issue.title}</h1>
      <ItemMetadata
        status={status}
        priority={priority}
        createdAt={meta ? meta.createdAt : undefined}
        updatedAt={meta ? meta.updatedAt : undefined}
      >
        <span className="org-issue-badge">Org Issue #{displayNum}</span>
      </ItemMetadata>
      <div className="issue-body">
        <TextEditor
          value={issue.description}
          onChange={() => undefined}
          format="md"
          mode="display"
        />
      </div>
    </>
  )
}
