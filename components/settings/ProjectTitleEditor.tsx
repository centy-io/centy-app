'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  SetProjectUserTitleRequestSchema,
  SetProjectTitleRequestSchema,
  type ProjectInfo,
} from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import '@/styles/components/ProjectTitleEditor.css'

interface ProjectTitleEditorProps {
  projectPath: string
}

type TitleScope = 'user' | 'project'

interface TitleScopeSelectorProps {
  scope: TitleScope
  onScopeChange: (scope: TitleScope) => void
}

function TitleScopeSelector({ scope, onScopeChange }: TitleScopeSelectorProps) {
  return (
    <>
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

      <p className="title-scope-hint">
        {scope === 'user'
          ? 'User titles are stored locally and only visible to you.'
          : 'Project titles are stored in .centy/project.json and shared with your team.'}
      </p>
    </>
  )
}

interface TitlePreviewProps {
  projectInfo: ProjectInfo
}

function TitlePreview({ projectInfo }: TitlePreviewProps) {
  return (
    <div className="title-preview">
      <h4 className="title-preview-label">Current Display Name</h4>
      <p className="title-preview-value">
        <strong>
          {projectInfo.userTitle ||
            projectInfo.projectTitle ||
            projectInfo.name ||
            'Unnamed Project'}
        </strong>
        <span className="title-source">
          (
          {projectInfo.userTitle
            ? 'user title'
            : projectInfo.projectTitle
              ? 'project title'
              : 'directory name'}
          )
        </span>
      </p>
    </div>
  )
}

async function saveTitle(
  scope: TitleScope,
  projectPath: string,
  title: string
) {
  if (scope === 'user') {
    const request = create(SetProjectUserTitleRequestSchema, {
      projectPath,
      title,
    })
    return centyClient.setProjectUserTitle(request)
  }

  const request = create(SetProjectTitleRequestSchema, {
    projectPath,
    title,
  })
  return centyClient.setProjectTitle(request)
}

interface TitleState {
  projectInfo: ProjectInfo | null
  setProjectInfo: (info: ProjectInfo | null) => void
  userTitle: string
  setUserTitle: (title: string) => void
  projectTitle: string
  setProjectTitle: (title: string) => void
  scope: TitleScope
}

function useTitleActions(projectPath: string, state: TitleState) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const applyResponse = useCallback(
    (project: ProjectInfo | undefined, clearField: TitleScope | null) => {
      if (!project) return
      state.setProjectInfo(project)
      state.setUserTitle(clearField === 'user' ? '' : project.userTitle || '')
      state.setProjectTitle(
        clearField === 'project' ? '' : project.projectTitle || ''
      )
    },
    [state]
  )

  const handleSave = useCallback(async () => {
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      const title =
        state.scope === 'user' ? state.userTitle : state.projectTitle
      const response = await saveTitle(state.scope, projectPath, title)
      if (!response.success) {
        setError(response.error || `Failed to save ${state.scope} title`)
        return
      }
      applyResponse(response.project, null)
      const label = state.scope === 'user' ? 'User' : 'Project'
      setSuccess(`${label} title saved successfully`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save title')
    } finally {
      setSaving(false)
    }
  }, [state, projectPath, applyResponse])

  const handleClear = useCallback(async () => {
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      const response = await saveTitle(state.scope, projectPath, '')
      if (!response.success) {
        setError(response.error || `Failed to clear ${state.scope} title`)
        return
      }
      applyResponse(response.project, state.scope)
      const label = state.scope === 'user' ? 'User' : 'Project'
      setSuccess(`${label} title cleared`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear title')
    } finally {
      setSaving(false)
    }
  }, [state.scope, projectPath, applyResponse])

  return { saving, error, success, handleSave, handleClear }
}

function useTitleEditor(projectPath: string) {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null)
  const [userTitle, setUserTitle] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [scope, setScope] = useState<TitleScope>('user')

  useEffect(() => {
    if (!projectPath) return

    const fetchProjectInfo = async () => {
      try {
        const request = create(ListProjectsRequestSchema, {})
        const response = await centyClient.listProjects(request)
        const project = response.projects.find(p => p.path === projectPath)
        if (!project) return
        setProjectInfo(project)
        setUserTitle(project.userTitle || '')
        setProjectTitle(project.projectTitle || '')
      } catch (err) {
        console.error('Failed to fetch project info:', err)
      }
    }

    fetchProjectInfo()
  }, [projectPath])

  const state: TitleState = {
    projectInfo,
    setProjectInfo,
    userTitle,
    setUserTitle,
    projectTitle,
    setProjectTitle,
    scope,
  }
  const actions = useTitleActions(projectPath, state)

  const currentTitle = scope === 'user' ? userTitle : projectTitle
  const setCurrentTitle = scope === 'user' ? setUserTitle : setProjectTitle
  const hasChanges =
    scope === 'user'
      ? userTitle !== ((projectInfo ? projectInfo.userTitle : '') || '')
      : projectTitle !== ((projectInfo ? projectInfo.projectTitle : '') || '')

  return {
    projectInfo,
    scope,
    setScope,
    currentTitle,
    setCurrentTitle,
    hasChanges,
    ...actions,
  }
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
  } = useTitleEditor(projectPath)

  if (!projectInfo) {
    return <div className="title-loading">Loading project info...</div>
  }

  return (
    <div className="project-title-editor">
      <TitleScopeSelector scope={scope} onScopeChange={setScope} />

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
