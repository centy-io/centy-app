'use client'

interface DeleteConfirmDialogProps {
  projectCount: number
  deleteError: string | null
  deleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteConfirmDialog(props: DeleteConfirmDialogProps) {
  const { projectCount, deleteError, deleting, onCancel, onConfirm } = props
  return (
    <div className="delete-confirm">
      <p>Are you sure you want to delete this organization?</p>
      {projectCount > 0 && (
        <p className="delete-warning">
          This organization has {projectCount} project(s). They will become
          ungrouped.
        </p>
      )}
      {deleteError && <p className="delete-error-message">{deleteError}</p>}
      <div className="delete-confirm-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="confirm-delete-btn"
        >
          {deleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  )
}
