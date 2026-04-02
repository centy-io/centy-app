'use client'

import '@/styles/components/StandaloneWorkspaceModal.css'
import type { StandaloneWorkspaceModalProps } from './StandaloneWorkspaceModal.types'
import { useStandaloneWorkspace } from './useStandaloneWorkspace'
import { WorkspaceFormBody } from './WorkspaceFormBody'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function StandaloneWorkspaceModal(props: StandaloneWorkspaceModalProps) {
  const state = useStandaloneWorkspace(props)

  return (
    <div className="standalone-modal-overlay">
      <div className="standalone-modal" ref={state.modalRef}>
        <div className="standalone-modal-header">
          <h3 className="standalone-modal-title">New Standalone Workspace</h3>
          <button className="standalone-modal-close" onClick={props.onClose}>
            &times;
          </button>
        </div>
        <div className="standalone-modal-body">
          {state.error && (
            <DaemonErrorMessage
              error={state.error}
              className="standalone-modal-error"
            />
          )}
          <WorkspaceFormBody
            name={state.name}
            setName={state.setName}
            description={state.description}
            setDescription={state.setDescription}
            ttlHours={state.ttlHours}
            setTtlHours={state.setTtlHours}
            selectedEditor={state.selectedEditor}
            setSelectedEditor={state.setSelectedEditor}
            isEditorAvailable={state.isEditorAvailable}
          />
        </div>
        <div className="standalone-modal-footer">
          <button className="standalone-modal-cancel" onClick={props.onClose}>
            Cancel
          </button>
          <button
            className="standalone-modal-submit"
            onClick={state.handleCreate}
            disabled={state.loading || !state.hasAvailableEditor}
          >
            {state.loading ? 'Creating...' : 'Create Workspace'}
          </button>
        </div>
      </div>
    </div>
  )
}
