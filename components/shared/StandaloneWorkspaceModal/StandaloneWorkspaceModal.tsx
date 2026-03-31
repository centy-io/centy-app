/* eslint-disable max-lines */
'use client'

import '@/styles/components/StandaloneWorkspaceModal.css'
import type { StandaloneWorkspaceModalProps } from './StandaloneWorkspaceModal.types'
import { TTL_OPTIONS } from './StandaloneWorkspaceModal.types'
import { useStandaloneWorkspace } from './useStandaloneWorkspace'
import { EditorPicker } from './EditorPicker'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface TtlSelectProps {
  ttlHours: number
  setTtlHours: (v: number) => void
}

function TtlSelect({ ttlHours, setTtlHours }: TtlSelectProps) {
  return (
    <div className="standalone-modal-field">
      <label className="standalone-modal-label" htmlFor="workspace-ttl">
        Workspace Duration
      </label>
      <select
        id="workspace-ttl"
        value={ttlHours}
        onChange={e => setTtlHours(Number(e.target.value))}
        className="standalone-modal-select"
      >
        {TTL_OPTIONS.map(option => (
          <option
            className="standalone-modal-option"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface WorkspaceFormBodyProps {
  name: string
  setName: (v: string) => void
  description: string
  setDescription: (v: string) => void
  ttlHours: number
  setTtlHours: (v: number) => void
  selectedEditor: string
  setSelectedEditor: (v: string) => void
  isEditorAvailable: (id: string) => boolean
}

function WorkspaceFormBody({
  name,
  setName,
  description,
  setDescription,
  ttlHours,
  setTtlHours,
  selectedEditor,
  setSelectedEditor,
  isEditorAvailable,
}: WorkspaceFormBodyProps) {
  return (
    <>
      <div className="standalone-modal-description">
        Create a temporary workspace without associating it with an issue. Great
        for quick experiments or exploratory work.
      </div>
      <div className="standalone-modal-field">
        <label className="standalone-modal-label" htmlFor="workspace-name">
          Name (optional)
        </label>
        <input
          id="workspace-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g., Experiment with new API"
          className="standalone-modal-input"
        />
      </div>
      <div className="standalone-modal-field">
        <label
          className="standalone-modal-label"
          htmlFor="workspace-description"
        >
          Description (optional)
        </label>
        <textarea
          id="workspace-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="What would you like to work on in this workspace?"
          className="standalone-modal-textarea"
          rows={3}
        />
      </div>
      <TtlSelect ttlHours={ttlHours} setTtlHours={setTtlHours} />
      <EditorPicker
        selectedEditor={selectedEditor}
        setSelectedEditor={setSelectedEditor}
        isEditorAvailable={isEditorAvailable}
      />
    </>
  )
}

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
