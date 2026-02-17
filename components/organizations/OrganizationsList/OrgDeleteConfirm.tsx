'use client'

interface OrgDeleteConfirmProps {
  deleteError: string | null
  deleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function OrgDeleteConfirm(props: OrgDeleteConfirmProps) {
  const { deleteError, deleting, onCancel, onConfirm } = props
  return (
    <div className="delete-confirm">
      <p>Are you sure you want to delete this organization?</p>
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
