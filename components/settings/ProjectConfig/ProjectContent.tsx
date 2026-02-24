'use client'

import { useProjectConfigData } from './useProjectConfigData'
import { useProjectOrg } from './useProjectOrg'
import { OrgSection } from './OrgSection'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import { ProjectTitleEditor } from '@/components/settings/ProjectTitleEditor'
import { AgentConfigEditor } from '@/components/settings/AgentConfigEditor'
import { ConfigSections } from '@/components/settings/Settings/ConfigSections'
import { ManifestSection } from '@/components/settings/Settings/ManifestSection'

interface ProjectContentProps {
  projectPath: string
  organizations: ReturnType<typeof useOrganization>['organizations']
  data: ReturnType<typeof useProjectConfigData>
  org: ReturnType<typeof useProjectOrg>
}

export function ProjectContent({
  projectPath,
  organizations,
  data,
  org,
}: ProjectContentProps) {
  if (data.loading) {
    return <div className="loading">Loading project configuration...</div>
  }
  return (
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
      <section className="settings-section">
        <h3 className="settings-section-title">Agent Configuration</h3>
        <div className="settings-card">
          <AgentConfigEditor />
        </div>
      </section>
      <ManifestSection manifest={data.manifest} />
    </>
  )
}
