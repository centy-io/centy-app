'use client'

import type { ReactElement } from 'react'
import { OrgSection } from './OrgSection'
import type { useProjectOrg } from './useProjectOrg'
import type { useProjectConfigData } from './useProjectConfigData'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import { ProjectTitleEditor } from '@/components/settings/ProjectTitleEditor'
import { ConfigSections } from '@/components/settings/Settings/ConfigSections'
import { ManifestSection } from '@/components/settings/Settings/ManifestSection'

type OrgState = ReturnType<typeof useProjectOrg>
type DataState = ReturnType<typeof useProjectConfigData>

interface ProjectConfigContentProps {
  projectPath: string
  data: DataState
  org: OrgState
  organizations: ReturnType<typeof useOrganization>['organizations']
}

export function ProjectConfigContent({
  projectPath,
  data,
  org,
  organizations,
}: ProjectConfigContentProps): ReactElement {
  if (data.loading) {
    return <div className="loading">Loading project configuration...</div>
  }
  return (
    <>
      <OrgSection
        organizations={organizations}
        projectOrgSlug={org.projectOrgSlug}
        savingOrg={org.savingOrg}
        onOrgChange={slug => {
          void org.handleOrgChange(slug)
        }}
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
          onSave={() => {
            void data.handleSaveConfig()
          }}
          onReset={data.handleResetConfig}
        />
      )}
      <ManifestSection manifest={data.manifest} />
    </>
  )
}
