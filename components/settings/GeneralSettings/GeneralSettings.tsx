'use client'

import { useDaemonActions } from './useDaemonActions'
import { DaemonInfoSection } from './DaemonInfoSection'
import { DaemonSettings } from '@/components/settings/DaemonSettings'
import { AgentConfigEditor } from '@/components/settings/AgentConfigEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

const { NEXT_PUBLIC_COMMIT_SHA } = process.env

export function GeneralSettings() {
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

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>General Settings</h2>
      </div>

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

      {NEXT_PUBLIC_COMMIT_SHA && (
        <section className="settings-section">
          <h3>App Information</h3>
          <div className="settings-card">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Commit SHA</span>
                <span className="info-value commit-sha">
                  {NEXT_PUBLIC_COMMIT_SHA.slice(0, 7)}
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
