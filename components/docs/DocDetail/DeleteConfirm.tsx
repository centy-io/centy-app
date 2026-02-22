interface DeleteConfirmProps {
  deleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteConfirm({
  deleting,
  onCancel,
  onConfirm,
}: DeleteConfirmProps) {
  return (
    <div className="delete-confirm">
      <p className="delete-confirm-message">Are you sure you want to delete this document?</p>
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
