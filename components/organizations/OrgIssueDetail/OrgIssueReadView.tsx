'use client'

import type { GenericItem } from '@/gen/centy_pb'
import { TextEditor } from '@/components/shared/TextEditor'
import { ItemMetadata } from '@/components/shared/ItemMetadata'
import { ItemTitle } from '@/components/shared/ItemView'
import { DetailLayout } from '@/components/shared/DetailLayout/DetailLayout'
import { LinkSection } from '@/components/shared/LinkSection'

interface OrgIssueReadViewProps {
  issue: GenericItem
}

export function OrgIssueReadView({ issue }: OrgIssueReadViewProps) {
  const meta = issue.metadata
  const displayNum = parseInt(
    meta ? meta.customFields.org_display_number || '0' : '0',
    10
  )
  const status = (meta && meta.status) ?? undefined
  const priority = meta ? meta.priority : undefined

  return (
    <DetailLayout
      main={
        <>
          <ItemTitle>{issue.title}</ItemTitle>
          <div className="issue-body">
            <TextEditor
              value={issue.body}
              onChange={() => undefined}
              format="md"
              mode="display"
            />
          </div>
        </>
      }
      sidebar={
        <>
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Properties</h3>
            <ItemMetadata
              status={status}
              priority={priority}
              createdAt={meta ? meta.createdAt : undefined}
              updatedAt={meta ? meta.updatedAt : undefined}
            >
              <span className="org-issue-badge">Org Issue #{displayNum}</span>
            </ItemMetadata>
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Relations</h3>
            <LinkSection
              entityId={issue.id}
              entityType="org_issue"
              editable={true}
            />
          </div>
        </>
      }
    />
  )
}
