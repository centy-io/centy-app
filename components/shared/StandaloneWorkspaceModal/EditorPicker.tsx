'use client'

import { EditorType } from '@/gen/centy_pb'
import { VscodeIcon, TerminalIcon } from './EditorIcons'

interface EditorPickerProps {
  selectedEditor: EditorType
  setSelectedEditor: (editor: EditorType) => void
  isEditorAvailable: (type: EditorType) => boolean
}

export function EditorPicker({
  selectedEditor,
  setSelectedEditor,
  isEditorAvailable,
}: EditorPickerProps) {
  return (
    <div className="standalone-modal-field">
      <label>Open In</label>
      <div className="standalone-modal-editor-options">
        <button
          type="button"
          className={`standalone-editor-option ${selectedEditor === EditorType.VSCODE ? 'selected' : ''} ${!isEditorAvailable(EditorType.VSCODE) ? 'disabled' : ''}`}
          onClick={() =>
            isEditorAvailable(EditorType.VSCODE) &&
            setSelectedEditor(EditorType.VSCODE)
          }
          disabled={!isEditorAvailable(EditorType.VSCODE)}
        >
          <VscodeIcon />
          <span>VS Code</span>
          {!isEditorAvailable(EditorType.VSCODE) && (
            <span className="unavailable-badge">Not available</span>
          )}
        </button>
        <button
          type="button"
          className={`standalone-editor-option ${selectedEditor === EditorType.TERMINAL ? 'selected' : ''} ${!isEditorAvailable(EditorType.TERMINAL) ? 'disabled' : ''}`}
          onClick={() =>
            isEditorAvailable(EditorType.TERMINAL) &&
            setSelectedEditor(EditorType.TERMINAL)
          }
          disabled={!isEditorAvailable(EditorType.TERMINAL)}
        >
          <TerminalIcon />
          <span>Terminal</span>
          {!isEditorAvailable(EditorType.TERMINAL) && (
            <span className="unavailable-badge">Not available</span>
          )}
        </button>
      </div>
    </div>
  )
}
