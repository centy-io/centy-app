import type { ProjectInfo } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface MoveModalBodyProps {
  entityType: 'issue' | 'doc'
  entityId: string
  entityTitle: string
  error: string | null
  projects: ProjectInfo[]
  selectedProject: string
  setSelectedProject: (value: string) => void
  loadingProjects: boolean
  newSlug: string
  setNewSlug: (value: string) => void
  selectedProjectInfo: ProjectInfo | undefined
}

export function MoveModalBody({
  entityType,
  entityId,
  entityTitle,
  error,
  projects,
  selectedProject,
  setSelectedProject,
  loadingProjects,
  newSlug,
  setNewSlug,
  selectedProjectInfo,
}: MoveModalBodyProps) {
  return (
    <div className="move-modal-body">
      {error && (
        <DaemonErrorMessage error={error} className="move-modal-error" />
      )}

      <div className="move-modal-info">
        <span className="move-modal-label">Moving:</span>
        <span className="move-modal-value">{entityTitle}</span>
      </div>

      <div className="move-modal-field">
        <label>Target Project</label>
        {loadingProjects ? (
          <div className="move-modal-loading">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="move-modal-empty">No other projects available</div>
        ) : (
          <select
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            className="move-modal-select"
          >
            {projects.map(project => (
              <option key={project.path} value={project.path}>
                {project.userTitle || project.projectTitle || project.name} (
                {project.displayPath})
              </option>
            ))}
          </select>
        )}
      </div>

      {entityType === 'doc' && (
        <div className="move-modal-field">
          <label>New Slug (optional - leave empty to keep current)</label>
          <input
            type="text"
            value={newSlug}
            onChange={e => setNewSlug(e.target.value)}
            placeholder={entityId}
            className="move-modal-input"
          />
          <span className="move-modal-hint">
            Change if the slug already exists in the target project
          </span>
        </div>
      )}

      {selectedProjectInfo && (
        <div className="move-modal-preview">
          <span className="move-modal-preview-label">
            This {entityType} will be moved to:
          </span>
          <span className="move-modal-preview-value">
            {selectedProjectInfo.name}
          </span>
        </div>
      )}
    </div>
  )
}
