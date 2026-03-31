import type { ReactElement } from 'react'

export interface DaemonConfirmDialogProps {
  danger?: boolean
  message: string
  onCancel: () => void
  onConfirm: () => void
  confirmLabel: string
  confirmClassName: string
}

export function DaemonConfirmDialog({
  danger,
  message,
  onCancel,
  onConfirm,
  confirmLabel,
  confirmClassName,
}: DaemonConfirmDialogProps): ReactElement {
  return (
    <div className={`confirm-dialog${danger ? ' danger' : ''}`}>
      <p className="confirm-dialog-text">{message}</p>
      <div className="confirm-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button onClick={onConfirm} className={confirmClassName}>
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}
