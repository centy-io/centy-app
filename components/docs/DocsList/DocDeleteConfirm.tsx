export function DocDeleteConfirm({
  docTitle,
  docSlug,
  deleting,
  onDeleteCancel,
  onDeleteConfirm,
}: {
  docTitle: string
  docSlug: string
  deleting: boolean
  onDeleteCancel: () => void
  onDeleteConfirm: (slug: string) => void
}) {
  return (
    <div className="delete-confirm-overlay">
      <p className="delete-confirm-message">Delete &ldquo;{docTitle}&rdquo;?</p>
      <div className="delete-confirm-actions">
        <button onClick={onDeleteCancel} className="cancel-btn">
          Cancel
        </button>
        <button
          onClick={() => onDeleteConfirm(docSlug)}
          disabled={deleting}
          className="confirm-delete-btn"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
