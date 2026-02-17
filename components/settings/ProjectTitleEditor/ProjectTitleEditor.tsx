'use client'

import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import '@/styles/components/ProjectTitleEditor.css'
import type { ProjectTitleEditorProps } from './ProjectTitleEditor.types'
import { useProjectTitle } from './useProjectTitle'
import { TitlePreview } from './TitlePreview'

export function ProjectTitleEditor({ projectPath }: ProjectTitleEditorProps) {
  const {
    projectInfo,
    scope,
    saving,
    error,
    success,
    currentTitle,
    hasChanges,
    setScope,
    setCurrentTitle,
    handleSave,
    handleClear,
  } = useProjectTitle(projectPath)

  if (!projectInfo) {
    return <div className="title-loading">Loading project info...</div>
  }

  return (
    <div className="project-title-editor">
      <div className="title-scope-selector">
        <span className="title-scope-label">Title Scope:</span>
        <div className="title-scope-buttons">
          <button
            type="button"
            onClick={() => setScope('user')}
            className={`title-scope-btn ${scope === 'user' ? 'active' : ''}`}
          >
            User (local)
          </button>
          <button
            type="button"
            onClick={() => setScope('project')}
            className={`title-scope-btn ${scope === 'project' ? 'active' : ''}`}
          >
            Project (shared)
          </button>
        </div>
      </div>

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
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="title-save-btn"
        >
          {saving ? 'Saving...' : 'Save Title'}
        </button>
        <button
          onClick={handleClear}
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
