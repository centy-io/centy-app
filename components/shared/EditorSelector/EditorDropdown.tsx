'use client'

import type { EditorInfo } from '@/gen/centy_pb'

interface EditorDropdownProps {
  editors: EditorInfo[]
  preferredEditor: string
  onSelectEditor: (editorId: string) => void
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
          key={editor.editorId}
          role="option"
          aria-selected={editor.editorId === preferredEditor}
          aria-disabled={!editor.available}
          className={`editor-option ${editor.editorId === preferredEditor ? 'selected' : ''} ${!editor.available ? 'disabled' : ''}`}
          onClick={() => editor.available && onSelectEditor(editor.editorId)}
          title={
            editor.available
              ? editor.description
              : `${editor.name} is not available`
          }
        >
          <div className="editor-option-content">
            <span className="editor-option-name">{editor.name}</span>
            {!editor.available && (
              <span className="editor-option-unavailable">Not available</span>
            )}
          </div>
          {editor.editorId === preferredEditor && editor.available && (
            <span className="editor-option-check">&#10003;</span>
          )}
        </li>
      ))}
    </ul>
  )
}
