'use client'

import type { useOrgIssueDetail } from './hooks/useOrgIssueDetail'

type OrgIssueDetailState = ReturnType<typeof useOrgIssueDetail>

interface IssueActionsProps {
  state: OrgIssueDetailState
}

export function IssueActions({ state }: IssueActionsProps): React.JSX.Element {
  if (!state.isEditing) {
    return (
      <>
        <button
          onClick={() => {
            state.setIsEditing(true)
          }}
          className="edit-btn"
        >
          Edit
        </button>
        <button
          onClick={() => {
            state.setShowDeleteConfirm(true)
          }}
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
        onClick={() => {
          void state.handleSave()
        }}
        disabled={state.saving || !state.editTitle.trim()}
        className="save-btn"
      >
        {state.saving ? 'Saving...' : 'Save'}
      </button>
    </>
  )
}
