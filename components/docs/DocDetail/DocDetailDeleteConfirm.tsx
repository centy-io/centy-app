'use client'

interface DocDetailDeleteConfirmProps {
  deleting: boolean
  onCancel: () => void
  onDelete: () => void
}

export function DocDetailDeleteConfirm({
  deleting,
  onCancel,
  onDelete,
}: DocDetailDeleteConfirmProps) {
  return (
    <div className="delete-confirm">
      <p>Are you sure you want to delete this document?</p>
      <div className="delete-confirm-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="confirm-delete-btn"
        >
          {deleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  )
}
