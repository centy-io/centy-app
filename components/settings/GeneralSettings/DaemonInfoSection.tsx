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

// eslint-disable-next-line max-lines-per-function
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
          <div className="confirm-dialog">
            <p className="confirm-dialog-text">Are you sure you want to restart the daemon?</p>
            <div className="confirm-actions">
              <button
                onClick={() => onShowRestartConfirm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={onRestart} className="confirm-btn">
                Yes, Restart
              </button>
            </div>
          </div>
        )}

        {showShutdownConfirm && (
          <div className="confirm-dialog danger">
            <p className="confirm-dialog-text">
              Are you sure you want to shutdown the daemon? You will need to
              manually restart it.
            </p>
            <div className="confirm-actions">
              <button
                onClick={() => onShowShutdownConfirm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={onShutdown} className="confirm-danger-btn">
                Yes, Shutdown
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
