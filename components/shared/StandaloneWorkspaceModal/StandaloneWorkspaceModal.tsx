'use client'

import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import '@/styles/components/StandaloneWorkspaceModal.css'
import type { StandaloneWorkspaceModalProps } from './StandaloneWorkspaceModal.types'
import { TTL_OPTIONS } from './StandaloneWorkspaceModal.types'
import { useStandaloneWorkspace } from './useStandaloneWorkspace'
import { EditorPicker } from './EditorPicker'

// eslint-disable-next-line max-lines-per-function
export function StandaloneWorkspaceModal(props: StandaloneWorkspaceModalProps) {
  const state = useStandaloneWorkspace(props)

  return (
    <div className="standalone-modal-overlay">
      <div className="standalone-modal" ref={state.modalRef}>
        <div className="standalone-modal-header">
          <h3>New Standalone Workspace</h3>
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

          <div className="standalone-modal-description">
            Create a temporary workspace without associating it with an issue.
            Great for quick experiments or exploratory work.
          </div>

          <div className="standalone-modal-field">
            <label htmlFor="workspace-name">Name (optional)</label>
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
            <label htmlFor="workspace-description">
              Description (optional)
            </label>
            <textarea
              id="workspace-description"
              value={state.description}
              onChange={e => state.setDescription(e.target.value)}
              placeholder="What would you like to work on in this workspace?"
              className="standalone-modal-textarea"
              rows={3}
            />
          </div>

          <div className="standalone-modal-field">
            <label htmlFor="workspace-ttl">Workspace Duration</label>
            <select
              id="workspace-ttl"
              value={state.ttlHours}
              onChange={e => state.setTtlHours(Number(e.target.value))}
              className="standalone-modal-select"
            >
              {TTL_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <EditorPicker
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
