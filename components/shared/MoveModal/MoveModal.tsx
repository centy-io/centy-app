/* eslint-disable max-lines */
'use client'

import '@/styles/components/MoveModal.css'
import type { MoveModalProps } from './MoveModal.types'
import { useMoveModal } from './useMoveModal'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

// eslint-disable-next-line max-lines-per-function
export function MoveModal(props: MoveModalProps) {
  const state = useMoveModal(props)

  return (
    <div className="move-modal-overlay">
      <div className="move-modal" ref={state.modalRef}>
        <div className="move-modal-header">
          <h3 className="move-modal-title">Move {props.entityType === 'issue' ? 'Issue' : 'Document'}</h3>
          <button className="move-modal-close" onClick={props.onClose}>
            x
          </button>
        </div>

        <div className="move-modal-body">
          {state.error && (
            <DaemonErrorMessage
              error={state.error}
              className="move-modal-error"
            />
          )}

          <div className="move-modal-info">
            <span className="move-modal-label">Moving:</span>
            <span className="move-modal-value">{props.entityTitle}</span>
          </div>

          <div className="move-modal-field">
            <label className="move-modal-label">Target Project</label>
            {state.loadingProjects ? (
              <div className="move-modal-loading">Loading projects...</div>
            ) : state.projects.length === 0 ? (
              <div className="move-modal-empty">
                No other projects available
              </div>
            ) : (
              <select
                value={state.selectedProject}
                onChange={e => state.setSelectedProject(e.target.value)}
                className="move-modal-select"
              >
                {state.projects.map(project => (
                  <option className="move-modal-option" key={project.path} value={project.path}>
                    {project.userTitle || project.projectTitle || project.name}{' '}
                    ({project.displayPath})
                  </option>
                ))}
              </select>
            )}
          </div>

          {props.entityType === 'doc' && (
            <div className="move-modal-field">
              <label className="move-modal-label">New Slug (optional - leave empty to keep current)</label>
              <input
                type="text"
                value={state.newSlug}
                onChange={e => state.setNewSlug(e.target.value)}
                placeholder={props.entityId}
                className="move-modal-input"
              />
              <span className="move-modal-hint">
                Change if the slug already exists in the target project
              </span>
            </div>
          )}

          {state.selectedProjectInfo && (
            <div className="move-modal-preview">
              <span className="move-modal-preview-label">
                This {props.entityType} will be moved to:
              </span>
              <span className="move-modal-preview-value">
                {state.selectedProjectInfo.name}
              </span>
            </div>
          )}
        </div>

        <div className="move-modal-footer">
          <button className="move-modal-cancel" onClick={props.onClose}>
            Cancel
          </button>
          <button
            className="move-modal-submit"
            onClick={state.handleMove}
            disabled={
              state.loading ||
              !state.selectedProject ||
              state.projects.length === 0
            }
          >
            {state.loading ? 'Moving...' : 'Move'}
          </button>
        </div>
      </div>
    </div>
  )
}
