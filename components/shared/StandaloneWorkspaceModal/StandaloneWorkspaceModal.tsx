'use client'

import '@/styles/components/StandaloneWorkspaceModal.css'
import type { StandaloneWorkspaceModalProps } from './StandaloneWorkspaceModal.types'
import { TTL_OPTIONS } from './StandaloneWorkspaceModal.types'
import { useStandaloneWorkspace } from './useStandaloneWorkspace'
import { EditorPicker } from './EditorPicker'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

const DESCRIPTION =
  'Create a temporary workspace without associating it with an issue. Great for quick experiments or exploratory work.'

type WorkspaceState = ReturnType<typeof useStandaloneWorkspace>

function WorkspaceFormFields({ state }: { state: WorkspaceState }) {
  return (
    <>
      <div className="standalone-modal-description">{DESCRIPTION}</div>
      <div className="standalone-modal-field">
        <label className="standalone-modal-label" htmlFor="workspace-name">
          Name (optional)
        </label>
        <input
          id="workspace-name"
          type="text"
          value={state.name}
          onChange={e => state.setName(e.target.value)}
          placeholder="e.g., Experiment with new API"
          className="standalone-modal-input"
        />
      </div>
      <div className="standalone-modal-field">
        <label className="standalone-modal-label" htmlFor="ws-desc">
          Description (optional)
        </label>
        <textarea
          id="ws-desc"
          value={state.description}
          onChange={e => state.setDescription(e.target.value)}
          placeholder="What would you like to work on in this workspace?"
          className="standalone-modal-textarea"
          rows={3}
        />
      </div>
      <div className="standalone-modal-field">
        <label className="standalone-modal-label" htmlFor="workspace-ttl">
          Workspace Duration
        </label>
        <select
          id="workspace-ttl"
          value={state.ttlHours}
          onChange={e => state.setTtlHours(Number(e.target.value))}
          className="standalone-modal-select"
        >
          {TTL_OPTIONS.map((o, i) => (
            <option key={i} value={o.value} className="standalone-modal-option">
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <EditorPicker
        selectedEditor={state.selectedEditor}
        setSelectedEditor={state.setSelectedEditor}
        isEditorAvailable={state.isEditorAvailable}
      />
    </>
  )
}

export function StandaloneWorkspaceModal(props: StandaloneWorkspaceModalProps) {
  const state = useStandaloneWorkspace(props)
  const e = state.error
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
          {e && (
            <DaemonErrorMessage error={e} className="standalone-modal-error" />
          )}
          <WorkspaceFormFields state={state} />
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
