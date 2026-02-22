'use client'

import type { DuplicateModalProps } from './DuplicateModal.types'
import type { useDuplicateModal } from './useDuplicateModal'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface DuplicateModalBodyProps {
  props: DuplicateModalProps
  state: ReturnType<typeof useDuplicateModal>
}

// eslint-disable-next-line max-lines-per-function
export function DuplicateModalBody({ props, state }: DuplicateModalBodyProps) {
  return (
    <div className="move-modal-body">
      {state.error && (
        <DaemonErrorMessage error={state.error} className="move-modal-error" />
      )}

      <div className="move-modal-info">
        <span className="move-modal-label">Duplicating:</span>
        <span className="move-modal-value">{props.entityTitle}</span>
      </div>

      <div className="move-modal-field">
        <label className="move-modal-label">Target Project</label>
        {state.loadingProjects ? (
          <div className="move-modal-loading">Loading projects...</div>
        ) : state.projects.length === 0 ? (
          <div className="move-modal-empty">No projects available</div>
        ) : (
          <select
            value={state.selectedProject}
            onChange={e => state.setSelectedProject(e.target.value)}
            className="move-modal-select"
          >
            {state.projects.map(project => (
              <option
                className="move-modal-option"
                key={project.path}
                value={project.path}
              >
                {project.userTitle || project.projectTitle || project.name}
                {project.path === props.currentProjectPath
                  ? ' (current)'
                  : ''}{' '}
                ({project.displayPath})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="move-modal-field">
        <label className="move-modal-label">New Title</label>
        <input
          type="text"
          value={state.newTitle}
          onChange={e => state.setNewTitle(e.target.value)}
          placeholder={`Copy of ${props.entityTitle}`}
          className="move-modal-input"
        />
      </div>

      {props.entityType === 'doc' && (
        <div className="move-modal-field">
          <label className="move-modal-label">New Slug</label>
          <input
            type="text"
            value={state.newSlug}
            onChange={e => state.setNewSlug(e.target.value)}
            placeholder={`${props.entitySlug}-copy`}
            className="move-modal-input"
          />
          <span className="move-modal-hint">
            URL-friendly identifier for the new document
          </span>
        </div>
      )}

      {state.selectedProjectInfo && (
        <div className="move-modal-preview">
          <span className="move-modal-preview-label">
            A copy will be created in:
          </span>
          <span className="move-modal-preview-value">
            {state.selectedProjectInfo.name}
            {state.isSameProject && ' (same project)'}
          </span>
        </div>
      )}
    </div>
  )
}
