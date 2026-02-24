/* eslint-disable max-lines */
'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import type { RouteLiteral } from 'nextjs-routes'
import type { OrgIssueDetailProps } from './OrgIssueDetail.types'
import { useOrgIssueDetail } from './hooks/useOrgIssueDetail'
import { OrgIssueEditForm } from './OrgIssueEditForm'
import { OrgIssueReadView } from './OrgIssueReadView'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'

type IssueState = ReturnType<typeof useOrgIssueDetail>

function IssueDetailHeader({
  state,
  backLink,
}: {
  state: IssueState
  backLink: RouteLiteral
}) {
  return (
    <div className="issue-detail-header">
      <Link href={backLink} className="back-link">
        ← Back to Org Issues
      </Link>
      <div className="issue-actions">
        {!state.isEditing ? (
          <>
            <button
              onClick={() => state.setIsEditing(true)}
              className="edit-btn"
            >
              Edit
            </button>
            <button
              onClick={() => state.setShowDeleteConfirm(true)}
              className="delete-btn"
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button onClick={state.handleCancelEdit} className="cancel-btn">
              Cancel
            </button>
            <button
              onClick={state.handleSave}
              disabled={state.saving || !state.editTitle.trim()}
              className="save-btn"
            >
              {state.saving ? 'Saving...' : 'Save'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function DeleteConfirm({ state }: { state: IssueState }) {
  return (
    <div className="delete-confirm">
      <p className="delete-confirm-message">
        Delete this org issue? This will remove it from all org projects.
      </p>
      {state.deleteError && (
        <p className="delete-error-message">{state.deleteError}</p>
      )}
      <div className="delete-confirm-actions">
        <button
          onClick={() => {
            state.setShowDeleteConfirm(false)
            state.setDeleteError(null)
          }}
          className="cancel-btn"
        >
          Cancel
        </button>
        <button
          onClick={state.handleDelete}
          disabled={state.deleting}
          className="confirm-delete-btn"
        >
          {state.deleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  )
}

export function OrgIssueDetail({ orgSlug, issueId }: OrgIssueDetailProps) {
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
      <IssueDetailHeader state={state} backLink={backLink} />
      {state.error && <DaemonErrorMessage error={state.error} />}
      {state.showDeleteConfirm && <DeleteConfirm state={state} />}
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
