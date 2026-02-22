'use client'

import type { Editor } from '@tiptap/react'
import { ToolbarFormatButtons } from './ToolbarFormatButtons'
import { ToolbarBlockButtons } from './ToolbarBlockButtons'

interface EditorToolbarProps {
  editor: Editor
  isRawMode: boolean
  toggleRawMode: () => void
  setLink: () => void
}

export function EditorToolbar({
  editor,
  isRawMode,
  toggleRawMode,
  setLink,
}: EditorToolbarProps) {
  return (
    <div className="editor-toolbar">
      <ToolbarFormatButtons editor={editor} />

      <div className="toolbar-separator" />

      <ToolbarBlockButtons editor={editor} />

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button
          type="button"
          onClick={setLink}
          className={editor.isActive('customLink') ? 'active' : ''}
          title="Add Link"
        >
          link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="toolbar-btn"
          title="Horizontal Rule"
        >
          &mdash;
        </button>
      </div>

      <div className="toolbar-spacer" />

      <div className="toolbar-group">
        <button
          type="button"
          onClick={toggleRawMode}
          className={isRawMode ? 'active' : ''}
          title="Toggle Raw Markdown"
        >
          {isRawMode ? 'WYSIWYG' : 'MD'}
        </button>
      </div>
    </div>
  )
}
