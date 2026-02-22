'use client'

import { useDaemonActions } from '@/components/settings/GeneralSettings/useDaemonActions'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'
import { DaemonInfoSection } from '@/components/settings/GeneralSettings/DaemonInfoSection'
import { DaemonSettings } from '@/components/settings/DaemonSettings'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

// eslint-disable-next-line max-lines-per-function
export function DaemonPage() {
  const { status, checkNow, lastChecked } = useDaemonStatus()
  const {
    daemonInfo,
    error,
    success,
    shuttingDown,
    restarting,
    showShutdownConfirm,
    setShowShutdownConfirm,
    showRestartConfirm,
    setShowRestartConfirm,
    handleShutdown,
    handleRestart,
  } = useDaemonActions()

  const getStatusLabel = (): string => {
    if (status === 'connected') return 'Connected'
    if (status === 'disconnected') return 'Disconnected'
    if (status === 'checking') return 'Checking...'
    return 'Demo Mode'
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2 className="settings-title">Daemon</h2>
        <button className="daemon-refresh-btn" onClick={checkNow}>
          Refresh Status
        </button>
      </div>

      <section className="settings-section">
        <h3 className="settings-section-title">Status</h3>
        <div className="settings-card">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Connection</span>
              <span className={`info-value daemon-status-text ${status}`}>
                {getStatusLabel()}
              </span>
            </div>
            {lastChecked && (
              <div className="info-item">
                <span className="info-label">Last Checked</span>
                <span className="info-value">
                  {lastChecked.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {error && <DaemonErrorMessage error={error} />}
      {success && <div className="success-message">{success}</div>}

      <DaemonInfoSection
        daemonInfo={daemonInfo}
        restarting={restarting}
        shuttingDown={shuttingDown}
        showRestartConfirm={showRestartConfirm}
        showShutdownConfirm={showShutdownConfirm}
        onShowRestartConfirm={setShowRestartConfirm}
        onShowShutdownConfirm={setShowShutdownConfirm}
        onRestart={handleRestart}
        onShutdown={handleShutdown}
      />

      <section className="settings-section">
        <h3 className="settings-section-title">Connection</h3>
        <div className="settings-card">
          <DaemonSettings />
        </div>
      </section>
    </div>
  )
}
