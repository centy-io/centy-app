'use client'

import Link from 'next/link'
import { DaemonSettings } from '@/components/settings/DaemonSettings'
import { ProjectTitleEditor } from '@/components/settings/ProjectTitleEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useSettingsData } from './useSettingsData'
import { useSettingsActions } from './useSettingsActions'
import { SettingsDaemonSection } from './SettingsDaemonSection'
import { SettingsConfigSections } from './SettingsConfigSections'
import { ManifestSection } from './ManifestSection'

export function Settings() {
  const data = useSettingsData()
  const actions = useSettingsActions({
    projectPath: data.projectPath,
    config: data.config,
    originalConfig: data.originalConfig,
    setConfig: config => data.setConfig(config),
    setOriginalConfig: config => data.setOriginalConfig(config),
    setError: data.setError,
    setSuccess: data.setSuccess,
  })

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Settings</h2>
        {data.isDirty && (
          <span className="unsaved-indicator">Unsaved changes</span>
        )}
      </div>

      {data.error && <DaemonErrorMessage error={data.error} />}
      {data.success && <div className="success-message">{data.success}</div>}

      <SettingsDaemonSection
        daemonInfo={data.daemonInfo}
        restarting={actions.restarting}
        shuttingDown={actions.shuttingDown}
        showRestartConfirm={actions.showRestartConfirm}
        showShutdownConfirm={actions.showShutdownConfirm}
        onShowRestart={() => actions.setShowRestartConfirm(true)}
        onShowShutdown={() => actions.setShowShutdownConfirm(true)}
        onCancelRestart={() => actions.setShowRestartConfirm(false)}
        onCancelShutdown={() => actions.setShowShutdownConfirm(false)}
        onRestart={actions.handleRestart}
        onShutdown={actions.handleShutdown}
      />

      <section className="settings-section">
        <h3>Daemon Connection</h3>
        <div className="settings-card">
          <DaemonSettings />
        </div>
      </section>

      {!data.projectPath && (
        <div className="no-project-message">
          <p>Select a project from the header to view project settings</p>
        </div>
      )}

      {data.projectPath && data.isInitialized === false && (
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/project/init">Initialize Project</Link>
        </div>
      )}

      {data.projectPath && data.isInitialized === true && (
        <>
          {data.loading ? (
            <div className="loading">Loading project settings...</div>
          ) : (
            <>
              <section className="settings-section">
                <h3>Project Title</h3>
                <div className="settings-card">
                  <ProjectTitleEditor projectPath={data.projectPath} />
                </div>
              </section>

              {data.config && (
                <SettingsConfigSections
                  config={data.config}
                  saving={actions.saving}
                  isDirty={data.isDirty}
                  updateConfig={actions.updateConfig}
                  onSave={actions.handleSaveConfig}
                  onReset={actions.handleResetConfig}
                />
              )}

              <ManifestSection manifest={data.manifest} />
            </>
          )}
        </>
      )}
    </div>
  )
}
