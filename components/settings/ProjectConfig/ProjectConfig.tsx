'use client'

import Link from 'next/link'
import { useProject } from '@/components/providers/ProjectProvider'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import { ProjectTitleEditor } from '@/components/settings/ProjectTitleEditor'
import { AgentConfigEditor } from '@/components/settings/AgentConfigEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { SettingsConfigSections } from '@/components/settings/Settings/SettingsConfigSections'
import { ManifestSection } from '@/components/settings/Settings/ManifestSection'
import { useProjectConfigData } from './useProjectConfigData'
import { useProjectConfigActions } from './useProjectConfigActions'
import { useOrgAssignment } from './useOrgAssignment'
import { OrgSection } from './OrgSection'

export function ProjectConfig() {
  const { projectPath, isInitialized, setIsInitialized } = useProject()
  const { organizations, refreshOrganizations } = useOrganization()

  const data = useProjectConfigData(
    projectPath,
    isInitialized,
    setIsInitialized
  )
  const actions = useProjectConfigActions({
    projectPath,
    config: data.config,
    originalConfig: data.originalConfig,
    setConfig: data.setConfig,
    setOriginalConfig: data.setOriginalConfig,
    setError: data.setError,
    setSuccess: data.setSuccess,
  })
  const org = useOrgAssignment({
    projectPath,
    isInitialized,
    refreshOrganizations,
    setError: data.setError,
    setSuccess: data.setSuccess,
  })

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Project Configuration</h2>
        {data.isDirty && (
          <span className="unsaved-indicator">Unsaved changes</span>
        )}
      </div>

      {data.error && <DaemonErrorMessage error={data.error} />}
      {data.success && <div className="success-message">{data.success}</div>}

      {!projectPath && (
        <div className="no-project-message">
          <p>Select a project from the header to view project configuration</p>
        </div>
      )}

      {projectPath && isInitialized === false && (
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/">Initialize Project</Link>
        </div>
      )}

      {projectPath && isInitialized === true && (
        <>
          {data.loading ? (
            <div className="loading">Loading project configuration...</div>
          ) : (
            <>
              <OrgSection
                projectOrgSlug={org.projectOrgSlug}
                savingOrg={org.savingOrg}
                organizations={organizations}
                onOrgChange={org.handleOrgChange}
              />

              <section className="settings-section">
                <h3>Project Title</h3>
                <div className="settings-card">
                  <ProjectTitleEditor projectPath={projectPath} />
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

              <section className="settings-section">
                <h3>Agent Configuration</h3>
                <div className="settings-card">
                  <AgentConfigEditor />
                </div>
              </section>

              <ManifestSection manifest={data.manifest} />
            </>
          )}
        </>
      )}
    </div>
  )
}
