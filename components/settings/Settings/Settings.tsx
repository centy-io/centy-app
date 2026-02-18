'use client'

import Link from 'next/link'
import { useSettingsData } from './useSettingsData'
import { ConfigSections } from './ConfigSections'
import { ManifestSection } from './ManifestSection'
import { useProject } from '@/components/providers/ProjectProvider'
import { DaemonSettings } from '@/components/settings/DaemonSettings'
import { ProjectTitleEditor } from '@/components/settings/ProjectTitleEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { DaemonInfoSection } from '@/components/settings/GeneralSettings/DaemonInfoSection'
import { useDaemonActions } from '@/components/settings/GeneralSettings/useDaemonActions'

// eslint-disable-next-line max-lines-per-function
export function Settings() {
  const { projectPath, isInitialized, setIsInitialized } = useProject()

  const daemon = useDaemonActions()
  const settings = useSettingsData(projectPath, isInitialized, setIsInitialized)

  const error = settings.error || daemon.error
  const success = settings.success || daemon.success

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Settings</h2>
        {settings.isDirty && (
          <span className="unsaved-indicator">Unsaved changes</span>
        )}
      </div>

      {error && <DaemonErrorMessage error={error} />}
      {success && <div className="success-message">{success}</div>}

      <DaemonInfoSection
        daemonInfo={daemon.daemonInfo}
        restarting={daemon.restarting}
        shuttingDown={daemon.shuttingDown}
        showRestartConfirm={daemon.showRestartConfirm}
        showShutdownConfirm={daemon.showShutdownConfirm}
        onShowRestartConfirm={daemon.setShowRestartConfirm}
        onShowShutdownConfirm={daemon.setShowShutdownConfirm}
        onRestart={daemon.handleRestart}
        onShutdown={daemon.handleShutdown}
      />

      <section className="settings-section">
        <h3>Daemon Connection</h3>
        <div className="settings-card">
          <DaemonSettings />
        </div>
      </section>

      {!projectPath && (
        <div className="no-project-message">
          <p>Select a project from the header to view project settings</p>
        </div>
      )}

      {projectPath && isInitialized === false && (
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/project/init">Initialize Project</Link>
        </div>
      )}

      {projectPath && isInitialized === true && (
        <>
          {settings.loading ? (
            <div className="loading">Loading project settings...</div>
          ) : (
            <>
              <section className="settings-section">
                <h3>Project Title</h3>
                <div className="settings-card">
                  <ProjectTitleEditor projectPath={projectPath} />
                </div>
              </section>

              {settings.config && (
                <ConfigSections
                  config={settings.config}
                  saving={settings.saving}
                  isDirty={settings.isDirty}
                  updateConfig={settings.updateConfig}
                  onSave={settings.handleSaveConfig}
                  onReset={settings.handleResetConfig}
                />
              )}

              <ManifestSection manifest={settings.manifest} />
            </>
          )}
        </>
      )}
    </div>
  )
}
