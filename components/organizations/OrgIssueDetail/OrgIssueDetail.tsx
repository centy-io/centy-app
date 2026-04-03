'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import type { RouteLiteral } from 'nextjs-routes'
import type { OrgIssueDetailProps } from './OrgIssueDetail.types'
import { useOrgIssueDetail } from './hooks/useOrgIssueDetail'
import { OrgIssueEditForm } from './OrgIssueEditForm'
import { OrgIssueReadView } from './OrgIssueReadView'
import { IssueActions } from './OrgIssueDetailParts'
import { DeleteConfirm } from '@/components/shared/DeleteConfirm'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'

function renderGuardState(
  state: ReturnType<typeof useOrgIssueDetail>,
  backLink: RouteLiteral
): React.JSX.Element | null {
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
  return null
}

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

  const guardView = renderGuardState(state, backLink)
  if (guardView) return guardView

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

      {state.showDeleteConfirm && (
        <DeleteConfirm
          message="Delete this org issue? This will remove it from all org projects."
          deleting={state.deleting}
          onCancel={() => {
            state.setShowDeleteConfirm(false)
            state.setDeleteError(null)
          }}
          onConfirm={() => {
            void state.handleDelete()
          }}
          error={state.deleteError}
        />
      )}

      <div className="issue-detail-content">
        {state.isEditing ? (
          <OrgIssueEditForm state={state} />
        ) : state.issue ? (
          <OrgIssueReadView issue={state.issue} />
        ) : null}
      </div>
    </div>
  )
}
