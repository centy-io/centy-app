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
        {isEditorAvailable('terminal') && (
          <button
            type="button"
            className={`standalone-editor-option ${selectedEditor === 'terminal' ? 'selected' : ''}`}
            onClick={() => setSelectedEditor('terminal')}
          >
            <span className="editor-option-name">Terminal</span>
          </button>
        )}
      </div>
    </div>
  )
}
