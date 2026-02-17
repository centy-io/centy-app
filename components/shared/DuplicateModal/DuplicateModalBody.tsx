import type { ProjectInfo } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { ProjectSelector } from './ProjectSelector'

interface DuplicateModalBodyProps {
  entityType: 'issue' | 'doc'
  entityTitle: string
  entitySlug?: string
  currentProjectPath: string
  error: string | null
  projects: ProjectInfo[]
  selectedProject: string
  setSelectedProject: (value: string) => void
  loadingProjects: boolean
  newTitle: string
  setNewTitle: (value: string) => void
  newSlug: string
  setNewSlug: (value: string) => void
  selectedProjectInfo: ProjectInfo | undefined
  isSameProject: boolean
}

export function DuplicateModalBody({
  entityType,
  entityTitle,
  entitySlug,
  currentProjectPath,
  error,
  projects,
  selectedProject,
  setSelectedProject,
  loadingProjects,
  newTitle,
  setNewTitle,
  newSlug,
  setNewSlug,
  selectedProjectInfo,
  isSameProject,
}: DuplicateModalBodyProps) {
  return (
    <div className="move-modal-body">
      {error && (
        <DaemonErrorMessage error={error} className="move-modal-error" />
      )}

      <div className="move-modal-info">
        <span className="move-modal-label">Duplicating:</span>
        <span className="move-modal-value">{entityTitle}</span>
      </div>

      <ProjectSelector
        projects={projects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        loadingProjects={loadingProjects}
        currentProjectPath={currentProjectPath}
      />

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

      {entityType === 'doc' && (
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
      )}

      {selectedProjectInfo && (
        <div className="move-modal-preview">
          <span className="move-modal-preview-label">
            A copy will be created in:
          </span>
          <span className="move-modal-preview-value">
            {selectedProjectInfo.name}
            {isSameProject && ' (same project)'}
          </span>
        </div>
      )}
    </div>
  )
}
