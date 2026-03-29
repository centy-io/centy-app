'use client'

import type { useOrganizationsList } from './useOrganizationsList'

type OrganizationsListState = ReturnType<typeof useOrganizationsList>

interface CascadeConfirmProps {
  state: OrganizationsListState
  projectCount: number
}

export function CascadeConfirm({
  state,
  projectCount,
}: CascadeConfirmProps): React.JSX.Element {
  return (
    <div className="delete-confirm">
      <p className="delete-confirm-message">
        This organization has {projectCount} project
        {projectCount !== 1 ? 's' : ''}. Untracking it will also untrack all of
        its projects. Do you want to continue?
      </p>
      {state.deleteError && (
        <p className="delete-error-message">{state.deleteError}</p>
      )}
      <div className="delete-confirm-actions">
        <button
          onClick={() => {
            state.setShowCascadeConfirm(null)
            state.setDeleteError(null)
          }}
          className="cancel-btn"
        >
          Cancel
        </button>
        <button
          onClick={() => state.handleDeleteCascade(state.showCascadeConfirm!)}
          disabled={state.deleting}
          className="confirm-delete-btn"
        >
          {state.deleting ? 'Untracking...' : 'Yes, Untrack All'}
        </button>
      </div>
    </div>
  )
}
