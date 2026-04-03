'use client'

import type { ReactElement } from 'react'
import { useProjectTitle } from './useProjectTitle'
import { TitlePreview } from './TitlePreview'
import { TitleScopeSelector } from './TitleScopeSelector'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import '@/styles/components/ProjectTitleEditor.css'

interface ProjectTitleEditorProps {
  projectPath: string
}

export function ProjectTitleEditor({
  projectPath,
}: ProjectTitleEditorProps): ReactElement {
  const {
    projectInfo,
    scope,
    setScope,
    saving,
    error,
    success,
    currentTitle,
    setCurrentTitle,
    hasChanges,
    handleSave,
    handleClear,
  } = useProjectTitle(projectPath)

  if (!projectInfo) {
    return <div className="title-loading">Loading project info...</div>
  }

  return (
    <div className="project-title-editor">
      <TitleScopeSelector scope={scope} onScopeChange={setScope} />
      <p className="title-scope-hint">
        {scope === 'user'
          ? 'User titles are stored locally and only visible to you.'
          : 'Project titles are stored in .centy/project.json and shared with your team.'}
      </p>
      <div className="title-input-group">
        <label htmlFor="project-title" className="title-input-label">
          Custom Title:
        </label>
        <input
          id="project-title"
          type="text"
          value={currentTitle}
          onChange={e => setCurrentTitle(e.target.value)}
          placeholder={projectInfo.name || 'Project name'}
          className="title-input"
        />
      </div>
      {error && <DaemonErrorMessage error={error} className="title-error" />}
      {success && <div className="title-success">{success}</div>}
      <div className="title-actions">
        <button
          onClick={() => {
            void handleSave()
          }}
          disabled={saving || !hasChanges}
          className="title-save-btn"
        >
          {saving ? 'Saving...' : 'Save Title'}
        </button>
        <button
          onClick={() => {
            void handleClear()
          }}
          disabled={saving || !currentTitle}
          className="title-clear-btn"
        >
          Clear Title
        </button>
      </div>
      <TitlePreview projectInfo={projectInfo} />
    </div>
  )
}
