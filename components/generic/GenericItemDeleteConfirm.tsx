interface GenericItemDeleteConfirmProps {
  itemLabel: string
  deleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function GenericItemDeleteConfirm({
  itemLabel,
  deleting,
  onCancel,
  onConfirm,
}: GenericItemDeleteConfirmProps) {
  return (
    <div className="delete-confirm-overlay">
      <p className="delete-confirm-message">
        Delete &ldquo;{itemLabel}&rdquo;?
      </p>
      <div className="delete-confirm-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="confirm-delete-btn"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
