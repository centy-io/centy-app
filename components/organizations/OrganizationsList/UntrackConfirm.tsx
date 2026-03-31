'use client'

import type { useOrganizationsList } from './useOrganizationsList'

type OrganizationsListState = ReturnType<typeof useOrganizationsList>

interface UntrackConfirmProps {
  state: OrganizationsListState
}

export function UntrackConfirm({
  state,
}: UntrackConfirmProps): React.JSX.Element {
  return (
    <div className="delete-confirm">
      <p className="delete-confirm-message">
        Are you sure you want to untrack this organization?
      </p>
      {state.deleteError && (
        <p className="delete-error-message">{state.deleteError}</p>
      )}
      <div className="delete-confirm-actions">
        <button
          onClick={() => {
            state.setShowDeleteConfirm(null)
            state.setDeleteError(null)
          }}
          className="cancel-btn"
        >
          Cancel
        </button>
        <button
          onClick={() => state.handleDelete(state.showDeleteConfirm!)}
          disabled={state.deleting}
          className="confirm-delete-btn"
        >
          {state.deleting ? 'Untracking...' : 'Yes, Untrack'}
        </button>
      </div>
    </div>
  )
}
