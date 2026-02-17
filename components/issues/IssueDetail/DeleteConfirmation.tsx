interface DeleteConfirmationProps {
  deleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteConfirmation({
  deleting,
  onCancel,
  onConfirm,
}: DeleteConfirmationProps) {
  return (
    <div className="delete-confirm">
      <p>Are you sure you want to delete this issue?</p>
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
