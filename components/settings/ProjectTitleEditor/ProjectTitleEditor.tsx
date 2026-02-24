'use client'

import type { TitleScope } from './TitleScope'
import { useProjectTitle } from './useProjectTitle'
import { TitlePreview } from './TitlePreview'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import '@/styles/components/ProjectTitleEditor.css'

interface ProjectTitleEditorProps {
  projectPath: string
}

interface ScopeSelectorProps {
  scope: TitleScope
  onScopeChange: (scope: TitleScope) => void
}

function ScopeSelector({ scope, onScopeChange }: ScopeSelectorProps) {
  return (
    <div className="title-scope-selector">
      <span className="title-scope-label">Title Scope:</span>
      <div className="title-scope-buttons">
        <button
          type="button"
          onClick={() => onScopeChange('user')}
          className={`title-scope-btn ${scope === 'user' ? 'active' : ''}`}
        >
          User (local)
        </button>
        <button
          type="button"
          onClick={() => onScopeChange('project')}
          className={`title-scope-btn ${scope === 'project' ? 'active' : ''}`}
        >
          Project (shared)
        </button>
      </div>
    </div>
  )
}

function getScopeHint(scope: TitleScope): string {
  if (scope === 'user')
    return 'User titles are stored locally and only visible to you.'
  return 'Project titles are stored in .centy/project.json and shared with your team.'
}

export function ProjectTitleEditor({ projectPath }: ProjectTitleEditorProps) {
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
      <ScopeSelector scope={scope} onScopeChange={setScope} />
      <p className="title-scope-hint">{getScopeHint(scope)}</p>
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
