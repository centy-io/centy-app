'use client'

import { DaemonSettings } from '@/components/settings/DaemonSettings'
import { AgentConfigEditor } from '@/components/settings/AgentConfigEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { DaemonInfoSection } from './DaemonInfoSection'
import { useDaemonControls } from './useDaemonControls'

export function GeneralSettings() {
  const {
    daemonInfo,
    error,
    success,
    shuttingDown,
    restarting,
    showShutdownConfirm,
    showRestartConfirm,
    setShowShutdownConfirm,
    setShowRestartConfirm,
    handleShutdown,
    handleRestart,
  } = useDaemonControls()

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>General Settings</h2>
      </div>

      {error && <DaemonErrorMessage error={error} />}
      {success && <div className="success-message">{success}</div>}

      <section className="settings-section">
        <h3>Daemon Information</h3>
        <DaemonInfoSection
          daemonInfo={daemonInfo}
          restarting={restarting}
          shuttingDown={shuttingDown}
          showRestartConfirm={showRestartConfirm}
          showShutdownConfirm={showShutdownConfirm}
          onShowRestart={() => setShowRestartConfirm(true)}
          onShowShutdown={() => setShowShutdownConfirm(true)}
          onCancelRestart={() => setShowRestartConfirm(false)}
          onCancelShutdown={() => setShowShutdownConfirm(false)}
          onRestart={handleRestart}
          onShutdown={handleShutdown}
        />
      </section>

      {process.env.NEXT_PUBLIC_COMMIT_SHA && (
        <section className="settings-section">
          <h3>App Information</h3>
          <div className="settings-card">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Commit SHA</span>
                <span className="info-value commit-sha">
                  {process.env.NEXT_PUBLIC_COMMIT_SHA.slice(0, 7)}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="settings-section">
        <h3>Daemon Connection</h3>
        <div className="settings-card">
          <DaemonSettings />
        </div>
      </section>

      <section className="settings-section">
        <h3>Agent Configuration</h3>
        <div className="settings-card">
          <AgentConfigEditor />
        </div>
      </section>
    </div>
  )
}
