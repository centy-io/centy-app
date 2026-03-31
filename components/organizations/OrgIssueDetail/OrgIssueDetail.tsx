'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import type { OrgIssueDetailProps } from './OrgIssueDetail.types'
import { useOrgIssueDetail } from './hooks/useOrgIssueDetail'
import { OrgIssueEditForm } from './OrgIssueEditForm'
import { OrgIssueReadView } from './OrgIssueReadView'
import { IssueActions, IssueDeleteConfirm } from './OrgIssueDetailParts'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'

export function OrgIssueDetail({
  orgSlug,
  issueId,
}: OrgIssueDetailProps): React.JSX.Element {
  const state = useOrgIssueDetail(orgSlug, issueId)

  useSaveShortcut({
    onSave: state.handleSave,
    enabled: state.isEditing && !state.saving && !!state.editTitle.trim(),
  })

  const backLink = route({
    pathname: '/organizations/[orgSlug]/issues',
    query: { orgSlug },
  })

  if (state.loading) {
    return (
      <div className="issue-detail">
        <div className="loading">Loading issue...</div>
      </div>
    )
  }

  if (state.error && !state.issue) {
    return (
      <div className="issue-detail">
        <DaemonErrorMessage error={state.error} />
        <Link href={backLink} className="back-link">
          Back to Org Issues
        </Link>
      </div>
    )
  }

  if (!state.issue) {
    return (
      <div className="issue-detail">
        <div className="error-message">Issue not found</div>
        <Link href={backLink} className="back-link">
          Back to Org Issues
        </Link>
      </div>
    )
  }

  return (
    <div className="issue-detail">
      <div className="issue-detail-header">
        <Link href={backLink} className="back-link">
          ← Back to Org Issues
        </Link>
        <div className="issue-actions">
          <IssueActions state={state} />
        </div>
      </div>

      {state.error && <DaemonErrorMessage error={state.error} />}

      {state.showDeleteConfirm && <IssueDeleteConfirm state={state} />}

      <div className="issue-detail-content">
        {state.isEditing ? (
          <OrgIssueEditForm state={state} />
        ) : (
          <OrgIssueReadView issue={state.issue} />
        )}
      </div>
    </div>
  )
}
