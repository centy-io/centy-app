import type { MoveModalProps } from './MoveModal.types'
import type { useMoveModal } from './useMoveModal'
import { ProjectSelect } from './ProjectSelect'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface MoveModalBodyProps {
  props: MoveModalProps
  state: ReturnType<typeof useMoveModal>
}

export function MoveModalBody({ props, state }: MoveModalBodyProps) {
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
        <ProjectSelect
          projects={state.projects}
          selectedProject={state.selectedProject}
          loadingProjects={state.loadingProjects}
          setSelectedProject={state.setSelectedProject}
        />
      </div>
      {props.entityType === 'doc' && (
        <div className="move-modal-field">
          <label className="move-modal-label">
            New Slug (optional - leave empty to keep current)
          </label>
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
  )
}
