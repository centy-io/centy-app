'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { route } from 'nextjs-routes'
import { useProjectConfigData } from './useProjectConfigData'
import { useProjectOrg } from './useProjectOrg'
import { OrgSection } from './OrgSection'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import { ProjectTitleEditor } from '@/components/settings/ProjectTitleEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { ConfigSections } from '@/components/settings/Settings/ConfigSections'
import { ManifestSection } from '@/components/settings/Settings/ManifestSection'

// eslint-disable-next-line max-lines-per-function
export function ProjectConfig() {
  const { projectPath, isInitialized } = usePathContext()
  const { organizations, refreshOrganizations } = useOrganization()

  const data = useProjectConfigData(projectPath, isInitialized)

  const org = useProjectOrg(
    projectPath,
    refreshOrganizations,
    data.setError,
    data.setSuccess
  )

  const { doFetchProjectData } = data
  const { fetchProjectOrg } = org

  useEffect(() => {
    if (isInitialized !== true) return
    doFetchProjectData()
    fetchProjectOrg()
  }, [isInitialized, doFetchProjectData, fetchProjectOrg])

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2 className="settings-title">Project Configuration</h2>
        {data.isDirty && (
          <span className="unsaved-indicator">Unsaved changes</span>
        )}
      </div>

      {data.error && <DaemonErrorMessage error={data.error} />}
      {data.success && <div className="success-message">{data.success}</div>}

      {!projectPath && (
        <div className="no-project-message">
          <p className="no-project-text">
            Select a project from the header to view project configuration
          </p>
        </div>
      )}

      {projectPath && isInitialized === false && (
        <div className="not-initialized-message">
          <p className="not-initialized-text">
            Centy is not initialized in this directory
          </p>
          <Link href={route({ pathname: '/' })}>Initialize Project</Link>
        </div>
      )}

      {projectPath && isInitialized === true && (
        <>
          {data.loading ? (
            <div className="loading">Loading project configuration...</div>
          ) : (
            <>
              <OrgSection
                organizations={organizations}
                projectOrgSlug={org.projectOrgSlug}
                savingOrg={org.savingOrg}
                onOrgChange={org.handleOrgChange}
              />

              <section className="settings-section">
                <h3 className="settings-section-title">Project Title</h3>
                <div className="settings-card">
                  <ProjectTitleEditor projectPath={projectPath} />
                </div>
              </section>

              {data.config && (
                <ConfigSections
                  config={data.config}
                  saving={data.saving}
                  isDirty={data.isDirty}
                  updateConfig={data.updateConfig}
                  onSave={data.handleSaveConfig}
                  onReset={data.handleResetConfig}
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
