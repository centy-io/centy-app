import type { GenericItem } from '@/gen/centy_pb'

interface DeleteConfirmOverlayProps {
  item: GenericItem
  deleting: boolean
  permanentStep: boolean
  setPermanentStep: (v: boolean) => void
  onCancel: () => void
  onSoftDelete: (id: string) => void
  onHardDelete: (id: string) => void
}

export function DeleteConfirmOverlay({
  item,
  deleting,
  permanentStep,
  setPermanentStep,
  onCancel,
  onSoftDelete,
  onHardDelete,
}: DeleteConfirmOverlayProps): React.JSX.Element {
  const label = item.title || item.id
  if (permanentStep) {
    return (
      <>
        <p className="delete-confirm-message">
          Permanently delete &ldquo;{label}&rdquo;? This cannot be undone.
        </p>
        <div className="delete-confirm-actions">
          <button
            onClick={() => setPermanentStep(false)}
            className="cancel-btn"
          >
            Go back
          </button>
          <button
            onClick={() => onHardDelete(item.id)}
            disabled={deleting}
            className="confirm-delete-btn"
          >
            {deleting ? 'Deleting...' : 'Delete permanently'}
          </button>
        </div>
      </>
    )
  }
  return (
    <>
      <p className="delete-confirm-message">Delete &ldquo;{label}&rdquo;?</p>
      <div className="delete-confirm-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button
          onClick={() => onSoftDelete(item.id)}
          disabled={deleting}
          className="archive-btn"
        >
          {deleting ? 'Archiving...' : 'Archive'}
        </button>
        <button
          onClick={() => setPermanentStep(true)}
          className="confirm-delete-btn"
        >
          Delete permanently
        </button>
      </div>
    </>
  )
}
