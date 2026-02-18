'use client'

interface DeleteConfirmDialogProps {
  message: string
  onCancel: () => void
  onConfirm: () => void
  deleting: boolean
}

export function DeleteConfirmDialog({
  message,
  onCancel,
  onConfirm,
  deleting,
}: DeleteConfirmDialogProps) {
  return (
    <div className="delete-confirm">
      <p>{message}</p>
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
