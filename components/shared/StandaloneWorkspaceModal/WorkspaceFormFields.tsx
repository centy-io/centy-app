'use client'

import { TTL_OPTIONS } from './StandaloneWorkspaceModal.types'
import { useStandaloneWorkspace } from './useStandaloneWorkspace'
import { EditorPicker } from './EditorPicker'

const DESCRIPTION =
  'Create a temporary workspace without associating it with an issue. Great for quick experiments or exploratory work.'

export function WorkspaceFormFields({
  state,
}: {
  state: ReturnType<typeof useStandaloneWorkspace>
}) {
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
          {TTL_OPTIONS.map(o => (
            <option
              key={o.value}
              value={o.value}
              className="standalone-modal-option"
            >
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
