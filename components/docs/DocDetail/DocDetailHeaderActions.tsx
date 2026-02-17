'use client'

import type { UseDocDetailReturn } from './DocDetail.types'

interface DocDetailHeaderActionsProps {
  state: UseDocDetailReturn
}

export function DocDetailHeaderActions({ state }: DocDetailHeaderActionsProps) {
  return (
    <div className="doc-actions">
      {!state.isEditing ? (
        <>
          <button onClick={() => state.setIsEditing(true)} className="edit-btn">
            Edit
          </button>
          <button
            onClick={() => state.setShowMoveModal(true)}
            className="move-btn"
          >
            Move
          </button>
          <button
            onClick={() => state.setShowDuplicateModal(true)}
            className="duplicate-btn"
          >
            Duplicate
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
            disabled={state.saving}
            className="save-btn"
          >
            {state.saving ? 'Saving...' : 'Save'}
          </button>
        </>
      )}
    </div>
  )
}
