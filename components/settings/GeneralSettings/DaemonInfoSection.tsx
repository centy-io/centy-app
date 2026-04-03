import type { ReactElement } from 'react'
import { DaemonConfirmDialog } from './DaemonConfirmDialog'
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
}: DaemonInfoSectionProps): ReactElement {
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
            onClick={() => {
              onShowRestartConfirm(true)
            }}
            className="restart-btn"
            disabled={restarting}
          >
            {restarting ? 'Restarting...' : 'Restart Daemon'}
          </button>
          <button
            onClick={() => {
              onShowShutdownConfirm(true)
            }}
            className="shutdown-btn"
            disabled={shuttingDown}
          >
            {shuttingDown ? 'Shutting down...' : 'Shutdown Daemon'}
          </button>
        </div>
        {showRestartConfirm && (
          <DaemonConfirmDialog
            message="Are you sure you want to restart the daemon?"
            onCancel={() => {
              onShowRestartConfirm(false)
            }}
            onConfirm={onRestart}
            confirmLabel="Yes, Restart"
            confirmClassName="confirm-btn"
          />
        )}
        {showShutdownConfirm && (
          <DaemonConfirmDialog
            danger
            message="Are you sure you want to shutdown the daemon? You will need to manually restart it."
            onCancel={() => {
              onShowShutdownConfirm(false)
            }}
            onConfirm={onShutdown}
            confirmLabel="Yes, Shutdown"
            confirmClassName="confirm-danger-btn"
          />
        )}
      </div>
    </section>
  )
}
