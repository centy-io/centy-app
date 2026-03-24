'use client'

interface EditorPickerProps {
  selectedEditor: string
  setSelectedEditor: (editorId: string) => void
  isEditorAvailable: (editorId: string) => boolean
}

export function EditorPicker({
  selectedEditor,
  setSelectedEditor,
  isEditorAvailable,
}: EditorPickerProps) {
  return (
    <div className="standalone-modal-field">
      <label className="standalone-modal-label">Open In</label>
      <div className="standalone-modal-editor-options">
        <button
          type="button"
          className={`standalone-editor-option ${selectedEditor === 'terminal' ? 'selected' : ''} ${!isEditorAvailable('terminal') ? 'disabled' : ''}`}
          onClick={() =>
            isEditorAvailable('terminal') && setSelectedEditor('terminal')
          }
          disabled={!isEditorAvailable('terminal')}
        >
          <span className="editor-option-name">Terminal</span>
          {!isEditorAvailable('terminal') && (
            <span className="unavailable-badge">Not available</span>
          )}
        </button>
      </div>
    </div>
  )
}
