import type { DaemonInfoSectionProps } from './GeneralSettings.types'

export function DaemonInfoSection({
  daemonInfo,
  restarting,
  shuttingDown,
  showRestartConfirm,
  showShutdownConfirm,
  onShowRestart,
  onShowShutdown,
  onCancelRestart,
  onCancelShutdown,
  onRestart,
  onShutdown,
}: DaemonInfoSectionProps) {
  return (
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
          onClick={onShowRestart}
          className="restart-btn"
          disabled={restarting}
        >
          {restarting ? 'Restarting...' : 'Restart Daemon'}
        </button>
        <button
          onClick={onShowShutdown}
          className="shutdown-btn"
          disabled={shuttingDown}
        >
          {shuttingDown ? 'Shutting down...' : 'Shutdown Daemon'}
        </button>
      </div>

      {showRestartConfirm && (
        <div className="confirm-dialog">
          <p>Are you sure you want to restart the daemon?</p>
          <div className="confirm-actions">
            <button onClick={onCancelRestart} className="cancel-btn">
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
          <p>
            Are you sure you want to shutdown the daemon? You will need to
            manually restart it.
          </p>
          <div className="confirm-actions">
            <button onClick={onCancelShutdown} className="cancel-btn">
              Cancel
            </button>
            <button onClick={onShutdown} className="confirm-danger-btn">
              Yes, Shutdown
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
