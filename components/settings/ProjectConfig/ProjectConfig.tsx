'use client'

import { useEffect } from 'react'
import type { ReactElement } from 'react'
import Link from 'next/link'
import { route } from 'nextjs-routes'
import { useProjectConfigData } from './useProjectConfigData'
import { useProjectOrg } from './useProjectOrg'
import { ProjectConfigContent } from './ProjectConfigContent'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function ProjectConfig(): ReactElement {
  const { projectPath, isInitialized } = usePathContext()
  const { organizations, refreshOrganizations } = useOrganization()

  const data = useProjectConfigData(projectPath, isInitialized)

  const org = useProjectOrg(
    projectPath,
    () => {
      void refreshOrganizations()
    },
    data.setError,
    data.setSuccess
  )

  const { doFetchProjectData } = data
  const { fetchProjectOrg } = org

  useEffect(() => {
    if (isInitialized !== true) return
    void doFetchProjectData()
    void fetchProjectOrg()
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
        <ProjectConfigContent
          projectPath={projectPath}
          data={data}
          org={org}
          organizations={organizations}
        />
      )}
    </div>
  )
}
