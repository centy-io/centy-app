'use client'

import { VscodeIcon, TerminalIcon } from './EditorIcons'
import { EditorType, type EditorInfo } from '@/gen/centy_pb'

interface EditorDropdownProps {
  editors: EditorInfo[]
  preferredEditor: EditorType
  onSelectEditor: (editorType: EditorType) => void
}

export function EditorDropdown({
  editors,
  preferredEditor,
  onSelectEditor,
}: EditorDropdownProps) {
  return (
    <ul className="editor-dropdown" role="listbox" aria-label="Editors">
      {editors.map(editor => (
        <li
          key={editor.editorType}
          role="option"
          aria-selected={editor.editorType === preferredEditor}
          aria-disabled={!editor.available}
          className={`editor-option ${editor.editorType === preferredEditor ? 'selected' : ''} ${!editor.available ? 'disabled' : ''}`}
          onClick={() => editor.available && onSelectEditor(editor.editorType)}
          title={
            editor.available
              ? editor.description
              : `${editor.name} is not available`
          }
        >
          <span className="editor-option-icon">
            {editor.editorType === EditorType.TERMINAL ? (
              <TerminalIcon />
            ) : (
              <VscodeIcon />
            )}
          </span>
          <div className="editor-option-content">
            <span className="editor-option-name">{editor.name}</span>
            {!editor.available && (
              <span className="editor-option-unavailable">Not available</span>
            )}
          </div>
          {editor.editorType === preferredEditor && editor.available && (
            <span className="editor-option-check">&#10003;</span>
          )}
        </li>
      ))}
    </ul>
  )
}
