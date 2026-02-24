import type { DaemonInfo } from '@/gen/centy_pb'

interface DaemonInfoSectionProps {
  daemonInfo: DaemonInfo | null
  restarting: boolean
  shuttingDown: boolean
  showRestartConfirm: boolean
  showShutdownConfirm: boolean
  onShowRestartConfirm: (show: boolean) => void
  onShowShutdownConfirm: (show: boolean) => void
  onRestart: () => void
  onShutdown: () => void
}

interface ConfirmDialogProps {
  message: string
  confirmLabel: string
  confirmClassName: string
  danger?: boolean
  onCancel: () => void
  onConfirm: () => void
}

function ConfirmDialog({
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

export function DaemonInfoSection({
  daemonInfo,
  restarting,
  shuttingDown,
  showRestartConfirm,
  showShutdownConfirm,
  onShowRestartConfirm,
  onShowShutdownConfirm,
  onRestart,
  onShutdown,
}: DaemonInfoSectionProps) {
  return (
    <section className="settings-section">
      <h3 className="settings-section-title">Daemon Information</h3>
      <div className="settings-card">
        {daemonInfo ? (
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Version</span>
              <span className="info-value">{daemonInfo.version}</span>
            </div>
          </div>
        ) : (
          <div className="loading-inline">Loading daemon info...</div>
        )}
        <div className="daemon-controls">
          <button
            onClick={() => onShowRestartConfirm(true)}
            className="restart-btn"
            disabled={restarting}
          >
            {restarting ? 'Restarting...' : 'Restart Daemon'}
          </button>
          <button
            onClick={() => onShowShutdownConfirm(true)}
            className="shutdown-btn"
            disabled={shuttingDown}
          >
            {shuttingDown ? 'Shutting down...' : 'Shutdown Daemon'}
          </button>
        </div>
        {showRestartConfirm && (
          <ConfirmDialog
            message="Are you sure you want to restart the daemon?"
            confirmLabel="Yes, Restart"
            confirmClassName="confirm-btn"
            onCancel={() => onShowRestartConfirm(false)}
            onConfirm={onRestart}
          />
        )}
        {showShutdownConfirm && (
          <ConfirmDialog
            message="Are you sure you want to shutdown the daemon? You will need to manually restart it."
            confirmLabel="Yes, Shutdown"
            confirmClassName="confirm-danger-btn"
            danger
            onCancel={() => onShowShutdownConfirm(false)}
            onConfirm={onShutdown}
          />
        )}
      </div>
    </section>
  )
}
