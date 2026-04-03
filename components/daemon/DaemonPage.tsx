'use client'

import type { ReactElement } from 'react'
import { DaemonStatusSection } from './DaemonStatusSection'
import { useDaemonActions } from '@/components/settings/GeneralSettings/useDaemonActions'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'
import { DaemonInfoSection } from '@/components/settings/GeneralSettings/DaemonInfoSection'
import { DaemonSettings } from '@/components/settings/DaemonSettings'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function DaemonPage(): ReactElement {
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

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2 className="settings-title">Daemon</h2>
        <button
          className="daemon-refresh-btn"
          onClick={() => {
            void checkNow()
          }}
        >
          Refresh Status
        </button>
      </div>

      <DaemonStatusSection
        status={status}
        lastChecked={lastChecked}
        checkNow={() => {
          void checkNow()
        }}
      />

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
        onRestart={() => {
          void handleRestart()
        }}
        onShutdown={() => {
          void handleShutdown()
        }}
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
