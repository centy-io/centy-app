'use client'

import { useSettingsData } from './useSettingsData'
import { ConfigSections } from './ConfigSections'
import { ManifestSection } from './ManifestSection'
import { ProjectTitleEditor } from '@/components/settings/ProjectTitleEditor'

interface ProjectSettingsContentProps {
  projectPath: string
  settings: ReturnType<typeof useSettingsData>
}

export function ProjectSettingsContent({
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
