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
      {editors
        .filter(editor => editor.available)
        .map(editor => (
          <li
            key={editor.editorId}
            role="option"
            aria-selected={editor.editorId === preferredEditor}
            className={`editor-option ${editor.editorId === preferredEditor ? 'selected' : ''}`}
            onClick={() => {
              onSelectEditor(editor.editorId)
            }}
            title={editor.description}
          >
            <div className="editor-option-content">
              <span className="editor-option-name">{editor.name}</span>
            </div>
            {editor.editorId === preferredEditor && (
              <span className="editor-option-check">&#10003;</span>
            )}
          </li>
        ))}
    </ul>
  )
}
