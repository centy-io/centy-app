'use client'

import '@/styles/components/MoveModal.css'
import type { MoveModalProps } from './MoveModal.types'
import { useMoveModal } from './useMoveModal'
import { MoveModalSlugField } from './MoveModalSlugField'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

type S = ReturnType<typeof useMoveModal>

function ProjectSelector({ state }: { state: S }) {
  if (state.loadingProjects)
    return <div className="move-modal-loading">Loading projects...</div>
  if (state.projects.length === 0)
    return <div className="move-modal-empty">No other projects available</div>
  return (
    <select
      value={state.selectedProject}
      onChange={e => state.setSelectedProject(e.target.value)}
      className="move-modal-select"
    >
      {state.projects.map(p => (
        <option className="move-modal-option" key={p.path} value={p.path}>
          {p.userTitle || p.projectTitle || p.name} ({p.displayPath})
        </option>
      ))}
    </select>
  )
}

function MoveModalBody({ props, state }: { props: MoveModalProps; state: S }) {
  return (
    <div className="move-modal-body">
      {state.error && (
        <DaemonErrorMessage error={state.error} className="move-modal-error" />
      )}
      <div className="move-modal-info">
        <span className="move-modal-label">Moving:</span>
        <span className="move-modal-value">{props.entityTitle}</span>
      </div>
      <div className="move-modal-field">
        <label className="move-modal-label">Target Project</label>
        <ProjectSelector state={state} />
      </div>
      <MoveModalSlugField props={props} state={state} />
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
  )
}

function MoveModalFooter({
  props,
  state,
}: {
  props: MoveModalProps
  state: S
}) {
  return (
    <div className="move-modal-footer">
      <button className="move-modal-cancel" onClick={props.onClose}>
        Cancel
      </button>
      <button
        className="move-modal-submit"
        onClick={state.handleMove}
        disabled={state.isDisabled}
      >
        {state.loading ? 'Moving...' : 'Move'}
      </button>
    </div>
  )
}

export function MoveModal(props: MoveModalProps) {
  const state = useMoveModal(props)
  return (
    <div className="move-modal-overlay">
      <div className="move-modal" ref={state.modalRef}>
        <div className="move-modal-header">
          <h3 className="move-modal-title">
            Move {props.entityType === 'issue' ? 'Issue' : 'Document'}
          </h3>
          <button className="move-modal-close" onClick={props.onClose}>
            x
          </button>
        </div>
        <MoveModalBody props={props} state={state} />
        <MoveModalFooter props={props} state={state} />
      </div>
    </div>
  )
}
