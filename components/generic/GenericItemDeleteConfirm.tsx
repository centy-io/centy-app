import { useState } from 'react'

interface GenericItemDeleteConfirmProps {
  itemLabel: string
  deleting: boolean
  onCancel: () => void
  onSoftDelete: () => void
  onHardDelete: () => void
}

export function GenericItemDeleteConfirm({
  itemLabel,
  deleting,
  onCancel,
  onSoftDelete,
  onHardDelete,
}: GenericItemDeleteConfirmProps) {
  const [step, setStep] = useState<'initial' | 'permanent'>('initial')

  if (step === 'permanent') {
    return (
      <div className="delete-confirm-overlay">
        <p className="delete-confirm-message">
          Permanently delete &ldquo;{itemLabel}&rdquo;? This cannot be undone.
        </p>
        <div className="delete-confirm-actions">
          <button onClick={() => setStep('initial')} className="cancel-btn">
            Go back
          </button>
          <button
            onClick={onHardDelete}
            disabled={deleting}
            className="confirm-delete-btn"
          >
            {deleting ? 'Deleting...' : 'Delete permanently'}
          </button>
        </div>
      </div>
    )
  }

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
          onClick={onSoftDelete}
          disabled={deleting}
          className="archive-btn"
        >
          {deleting ? 'Archiving...' : 'Archive'}
        </button>
        <button
          onClick={() => setStep('permanent')}
          className="confirm-delete-btn"
        >
          Delete permanently
        </button>
      </div>
    </div>
  )
}
