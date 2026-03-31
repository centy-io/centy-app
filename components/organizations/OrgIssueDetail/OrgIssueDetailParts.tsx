'use client'

import type { useOrgIssueDetail } from './hooks/useOrgIssueDetail'

type OrgIssueDetailState = ReturnType<typeof useOrgIssueDetail>

interface DeleteConfirmProps {
  state: OrgIssueDetailState
}

export function IssueDeleteConfirm({
  state,
}: DeleteConfirmProps): React.JSX.Element {
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

interface IssueActionsProps {
  state: OrgIssueDetailState
}

export function IssueActions({ state }: IssueActionsProps): React.JSX.Element {
  if (!state.isEditing) {
    return (
      <>
        <button onClick={() => state.setIsEditing(true)} className="edit-btn">
          Edit
        </button>
        <button
          onClick={() => state.setShowDeleteConfirm(true)}
          className="delete-btn"
        >
          Delete
        </button>
      </>
    )
  }
  return (
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
  )
}
