interface ConfirmDialogProps {
  message: string
  confirmLabel: string
  confirmClassName: string
  danger?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  message,
  confirmLabel,
  confirmClassName,
  danger,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
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
