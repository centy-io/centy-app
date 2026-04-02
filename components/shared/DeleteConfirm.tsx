'use client'

import { useState, useEffect } from 'react'

interface DeleteConfirmProps {
  message: string
  confirmLabel?: string
  deleting: boolean
  onCancel: () => void
  onConfirm: () => void
  onSoftDelete?: () => void
  error?: string | null
  children?: React.ReactNode
}

function getLoadingLabel(label: string): string {
  const word = label.split(' ')[0]
  const base = word.endsWith('e') ? word.slice(0, -1) : word
  return base + 'ing...'
}

export function DeleteConfirm({
  message,
  confirmLabel,
  deleting,
  onCancel,
  onConfirm,
  onSoftDelete,
  error,
  children,
}: DeleteConfirmProps): React.JSX.Element {
  const label = confirmLabel !== undefined ? confirmLabel : 'Delete'
  const [pendingAction, setPendingAction] = useState<'soft' | 'hard' | null>(
    null
  )

  useEffect(() => {
    if (!deleting) setPendingAction(null)
  }, [deleting])

  function handleSoftDelete() {
    setPendingAction('soft')
    onSoftDelete!()
  }

  function handleConfirm() {
    setPendingAction('hard')
    onConfirm()
  }

  const archiving = deleting && pendingAction === 'soft'
  const hardDeleting = deleting && pendingAction === 'hard'

  return (
    <div className="delete-confirm">
      <p className="delete-confirm-message">{message}</p>
      {onSoftDelete && (
        <p className="delete-confirm-hint">
          Archive keeps it recoverable. Delete removes it permanently.
        </p>
      )}
      {children}
      {error && <p className="delete-error-message">{error}</p>}
      <div className="delete-confirm-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        {onSoftDelete && (
          <button
            onClick={handleSoftDelete}
            disabled={deleting}
            className="archive-btn"
          >
            {archiving ? 'Archiving...' : 'Archive'}
          </button>
        )}
        <button
          onClick={handleConfirm}
          disabled={deleting}
          className="confirm-delete-btn"
        >
          {hardDeleting ? getLoadingLabel(label) : label}
        </button>
      </div>
    </div>
  )
}
