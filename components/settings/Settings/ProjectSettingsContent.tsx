'use client'

import type { ReactElement } from 'react'
import { ConfigSections } from './ConfigSections'
import { ManifestSection } from './ManifestSection'
import type { useSettingsData } from './useSettingsData'
import { ProjectTitleEditor } from '@/components/settings/ProjectTitleEditor'

type SettingsData = ReturnType<typeof useSettingsData>

interface ProjectSettingsContentProps {
  projectPath: string
  settings: SettingsData
}

export function ProjectSettingsContent({
  projectPath,
  settings,
}: ProjectSettingsContentProps): ReactElement {
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
          onSave={() => {
            void settings.handleSaveConfig()
          }}
          onReset={settings.handleResetConfig}
        />
      )}
      <ManifestSection manifest={settings.manifest} />
    </>
  )
}
