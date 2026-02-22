'use client'

import type { Editor } from '@tiptap/react'

interface ToolbarFormatButtonsProps {
  editor: Editor
}

export function ToolbarFormatButtons({ editor }: ToolbarFormatButtonsProps) {
  return (
    <div className="toolbar-group">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'active' : ''}
        title="Bold (Ctrl+B)"
      >
        <strong className="toolbar-format-bold">B</strong>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'active' : ''}
        title="Italic (Ctrl+I)"
      >
        <em className="toolbar-format-italic">I</em>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'active' : ''}
        title="Strikethrough"
      >
        <s className="toolbar-format-strike">S</s>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'active' : ''}
        title="Inline Code"
      >
        {'</>'}
      </button>
    </div>
  )
}
