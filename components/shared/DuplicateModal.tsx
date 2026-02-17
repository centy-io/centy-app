'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  DuplicateIssueRequestSchema,
  DuplicateDocRequestSchema,
  type ProjectInfo,
} from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import '@/styles/components/MoveModal.css'

interface DuplicateModalProps {
  entityType: 'issue' | 'doc'
  entityId: string
  entityTitle: string
  entitySlug?: string
  currentProjectPath: string
  onClose: () => void
  onDuplicated: (newEntityId: string, targetProjectPath: string) => void
}

function useLoadProjects(currentProjectPath: string) {
  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [selectedProject, setSelectedProject] =
    useState<string>(currentProjectPath)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProjects() {
      try {
        const request = create(ListProjectsRequestSchema, {
          includeStale: false,
          includeUninitialized: false,
          includeArchived: false,
        })
        const response = await centyClient.listProjects(request)
        setProjects(response.projects)
        setSelectedProject(currentProjectPath)
      } catch (err) {
        console.error('Failed to load projects:', err)
        setLoadError('Failed to load projects')
      } finally {
        setLoadingProjects(false)
      }
    }

    loadProjects()
  }, [currentProjectPath])

  return {
    projects,
    selectedProject,
    setSelectedProject,
    loadingProjects,
    loadError,
  }
}

function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  onClose: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ref, onClose])
}

function useEscapeKey(onClose: () => void) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])
}

function useDuplicate(
  entityType: 'issue' | 'doc',
  entityId: string,
  currentProjectPath: string,
  selectedProject: string,
  newTitle: string,
  newSlug: string,
  onDuplicated: (newEntityId: string, targetProjectPath: string) => void
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDuplicate = useCallback(async () => {
    if (!selectedProject) return

    setLoading(true)
    setError(null)

    try {
      if (entityType === 'issue') {
        const request = create(DuplicateIssueRequestSchema, {
          sourceProjectPath: currentProjectPath,
          issueId: entityId,
          targetProjectPath: selectedProject,
          newTitle: newTitle || undefined,
        })
        const response = await centyClient.duplicateIssue(request)

        if (response.success && response.issue) {
          onDuplicated(response.issue.id, selectedProject)
        } else {
          setError(response.error || 'Failed to duplicate issue')
        }
      } else {
        const request = create(DuplicateDocRequestSchema, {
          sourceProjectPath: currentProjectPath,
          slug: entityId,
          targetProjectPath: selectedProject,
          newSlug: newSlug || undefined,
          newTitle: newTitle || undefined,
        })
        const response = await centyClient.duplicateDoc(request)

        if (response.success && response.doc) {
          onDuplicated(response.doc.slug, selectedProject)
        } else {
          setError(response.error || 'Failed to duplicate document')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate')
    } finally {
      setLoading(false)
    }
  }, [
    entityType,
    entityId,
    currentProjectPath,
    selectedProject,
    newTitle,
    newSlug,
    onDuplicated,
  ])

  return { loading, error, handleDuplicate }
}

function ProjectSelector({
  loadingProjects,
  projects,
  selectedProject,
  setSelectedProject,
  currentProjectPath,
}: {
  loadingProjects: boolean
  projects: ProjectInfo[]
  selectedProject: string
  setSelectedProject: (value: string) => void
  currentProjectPath: string
}) {
  return (
    <div className="move-modal-field">
      <label>Target Project</label>
      {loadingProjects ? (
        <div className="move-modal-loading">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="move-modal-empty">No projects available</div>
      ) : (
        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          className="move-modal-select"
        >
          {projects.map(project => (
            <option key={project.path} value={project.path}>
              {project.userTitle || project.projectTitle || project.name}
              {project.path === currentProjectPath ? ' (current)' : ''} (
              {project.displayPath})
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

function DocSlugField({
  entitySlug,
  newSlug,
  setNewSlug,
}: {
  entitySlug?: string
  newSlug: string
  setNewSlug: (value: string) => void
}) {
  return (
    <div className="move-modal-field">
      <label>New Slug</label>
      <input
        type="text"
        value={newSlug}
        onChange={e => setNewSlug(e.target.value)}
        placeholder={`${entitySlug}-copy`}
        className="move-modal-input"
      />
      <span className="move-modal-hint">
        URL-friendly identifier for the new document
      </span>
    </div>
  )
}

function DuplicatePreview({
  selectedProjectInfo,
  isSameProject,
}: {
  selectedProjectInfo: ProjectInfo
  isSameProject: boolean
}) {
  return (
    <div className="move-modal-preview">
      <span className="move-modal-preview-label">
        A copy will be created in:
      </span>
      <span className="move-modal-preview-value">
        {selectedProjectInfo.name}
        {isSameProject && ' (same project)'}
      </span>
    </div>
  )
}

function NewTitleField({
  newTitle,
  setNewTitle,
  entityTitle,
}: {
  newTitle: string
  setNewTitle: (value: string) => void
  entityTitle: string
}) {
  return (
    <div className="move-modal-field">
      <label>New Title</label>
      <input
        type="text"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        placeholder={`Copy of ${entityTitle}`}
        className="move-modal-input"
      />
    </div>
  )
}

function DuplicateModalBody({
  displayError,
  entityTitle,
  entityType,
  entitySlug,
  loadingProjects,
  projects,
  selectedProject,
  setSelectedProject,
  currentProjectPath,
  newTitle,
  setNewTitle,
  newSlug,
  setNewSlug,
  selectedProjectInfo,
  isSameProject,
}: {
  displayError: string | null
  entityTitle: string
  entityType: 'issue' | 'doc'
  entitySlug?: string
  loadingProjects: boolean
  projects: ProjectInfo[]
  selectedProject: string
  setSelectedProject: (value: string) => void
  currentProjectPath: string
  newTitle: string
  setNewTitle: (value: string) => void
  newSlug: string
  setNewSlug: (value: string) => void
  selectedProjectInfo: ProjectInfo | undefined
  isSameProject: boolean
}) {
  return (
    <div className="move-modal-body">
      {displayError && (
        <DaemonErrorMessage error={displayError} className="move-modal-error" />
      )}

      <div className="move-modal-info">
        <span className="move-modal-label">Duplicating:</span>
        <span className="move-modal-value">{entityTitle}</span>
      </div>

      <ProjectSelector
        loadingProjects={loadingProjects}
        projects={projects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        currentProjectPath={currentProjectPath}
      />

      <NewTitleField
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        entityTitle={entityTitle}
      />

      {entityType === 'doc' && (
        <DocSlugField
          entitySlug={entitySlug}
          newSlug={newSlug}
          setNewSlug={setNewSlug}
        />
      )}

      {selectedProjectInfo && (
        <DuplicatePreview
          selectedProjectInfo={selectedProjectInfo}
          isSameProject={isSameProject}
        />
      )}
    </div>
  )
}

function DuplicateModalFooter({
  onClose,
  handleDuplicate,
  loading,
  selectedProject,
  projectCount,
}: {
  onClose: () => void
  handleDuplicate: () => void
  loading: boolean
  selectedProject: string
  projectCount: number
}) {
  return (
    <div className="move-modal-footer">
      <button className="move-modal-cancel" onClick={onClose}>
        Cancel
      </button>
      <button
        className="move-modal-submit"
        onClick={handleDuplicate}
        disabled={loading || !selectedProject || projectCount === 0}
      >
        {loading ? 'Duplicating...' : 'Duplicate'}
      </button>
    </div>
  )
}

function useDuplicateModalState(
  entityType: 'issue' | 'doc',
  entityId: string,
  entityTitle: string,
  entitySlug: string | undefined,
  currentProjectPath: string,
  onDuplicated: (newEntityId: string, targetProjectPath: string) => void
) {
  const [newTitle, setNewTitle] = useState(`Copy of ${entityTitle}`)
  const [newSlug, setNewSlug] = useState(entitySlug ? `${entitySlug}-copy` : '')

  const {
    projects,
    selectedProject,
    setSelectedProject,
    loadingProjects,
    loadError,
  } = useLoadProjects(currentProjectPath)

  const { loading, error, handleDuplicate } = useDuplicate(
    entityType,
    entityId,
    currentProjectPath,
    selectedProject,
    newTitle,
    newSlug,
    onDuplicated
  )

  const displayError = error || loadError
  const selectedProjectInfo = projects.find(p => p.path === selectedProject)
  const isSameProject = selectedProject === currentProjectPath

  return {
    newTitle,
    setNewTitle,
    newSlug,
    setNewSlug,
    projects,
    selectedProject,
    setSelectedProject,
    loadingProjects,
    loading,
    handleDuplicate,
    displayError,
    selectedProjectInfo,
    isSameProject,
  }
}

export function DuplicateModal({
  entityType,
  entityId,
  entityTitle,
  entitySlug,
  currentProjectPath,
  onClose,
  onDuplicated,
}: DuplicateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  const state = useDuplicateModalState(
    entityType,
    entityId,
    entityTitle,
    entitySlug,
    currentProjectPath,
    onDuplicated
  )

  useClickOutside(modalRef, onClose)
  useEscapeKey(onClose)

  return (
    <div className="move-modal-overlay">
      <div className="move-modal" ref={modalRef}>
        <div className="move-modal-header">
          <h3>Duplicate {entityType === 'issue' ? 'Issue' : 'Document'}</h3>
          <button className="move-modal-close" onClick={onClose}>
            x
          </button>
        </div>

        <DuplicateModalBody
          displayError={state.displayError}
          entityTitle={entityTitle}
          entityType={entityType}
          entitySlug={entitySlug}
          loadingProjects={state.loadingProjects}
          projects={state.projects}
          selectedProject={state.selectedProject}
          setSelectedProject={state.setSelectedProject}
          currentProjectPath={currentProjectPath}
          newTitle={state.newTitle}
          setNewTitle={state.setNewTitle}
          newSlug={state.newSlug}
          setNewSlug={state.setNewSlug}
          selectedProjectInfo={state.selectedProjectInfo}
          isSameProject={state.isSameProject}
        />

        <DuplicateModalFooter
          onClose={onClose}
          handleDuplicate={state.handleDuplicate}
          loading={state.loading}
          selectedProject={state.selectedProject}
          projectCount={state.projects.length}
        />
      </div>
    </div>
  )
}
