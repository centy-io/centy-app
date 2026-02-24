'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import { useSettingsData } from './useSettingsData'
import { ConfigSections } from './ConfigSections'
import { ManifestSection } from './ManifestSection'
import { useProject } from '@/components/providers/ProjectProvider'
import { DaemonSettings } from '@/components/settings/DaemonSettings'
import { ProjectTitleEditor } from '@/components/settings/ProjectTitleEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { DaemonInfoSection } from '@/components/settings/GeneralSettings/DaemonInfoSection'
import { useDaemonActions } from '@/components/settings/GeneralSettings/useDaemonActions'

type SettingsData = ReturnType<typeof useSettingsData>

interface ProjectSettingsContentProps {
  projectPath: string
  settings: SettingsData
}

function ProjectSettingsContent({
  projectPath,
  settings,
}: ProjectSettingsContentProps) {
  if (settings.loading) {
    return <div className="loading">Loading project settings...</div>
  }
  return (
    <>
      <section className="settings-section">
        <h3 className="settings-section-title">Project Title</h3>
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
  )
}

export function Settings() {
  const { projectPath, isInitialized } = useProject()
  const daemon = useDaemonActions()
  const settings = useSettingsData(projectPath, isInitialized)
  const error = settings.error || daemon.error
  const success = settings.success || daemon.success

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
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
        <h3 className="settings-section-title">Daemon Connection</h3>
        <div className="settings-card">
          <DaemonSettings />
        </div>
      </section>
      {!projectPath && (
        <div className="no-project-message">
          <p className="no-project-text">
            Select a project from the header to view project settings
          </p>
        </div>
      )}
      {projectPath && isInitialized === false && (
        <div className="not-initialized-message">
          <p className="not-initialized-text">
            Centy is not initialized in this directory
          </p>
          <Link href={route({ pathname: '/project/init' })}>
            Initialize Project
          </Link>
        </div>
      )}
      {projectPath && isInitialized === true && (
        <ProjectSettingsContent projectPath={projectPath} settings={settings} />
      )}
    </div>
  )
}
