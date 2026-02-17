'use client'

import { EditorContent } from '@tiptap/react'
import type { TextEditorProps } from './TextEditor.types'
import { useTextEditorState } from './hooks/useTextEditorState'
import { EditorToolbar } from './EditorToolbar'

export function TextEditor({
  value,
  onChange,
  format = 'md',
  mode = 'edit',
  allowModeToggle = false,
  onModeChange,
  placeholder = 'Write your content...',
  minHeight = 200,
  className = '',
}: TextEditorProps) {
  const {
    editor,
    currentMode,
    isEditable,
    isRawMode,
    rawValue,
    handleRawChange,
    toggleRawMode,
    handleModeToggle,
    setLink,
  } = useTextEditorState({
    value,
    onChange,
    format,
    mode,
    onModeChange,
    placeholder,
  })

  if (!editor) {
    return null
  }

  const editorClassName = [
    'text-editor',
    `text-editor--${currentMode}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={editorClassName}>
      {isEditable && (
        <EditorToolbar
          editor={editor}
          isRawMode={isRawMode}
          toggleRawMode={toggleRawMode}
          setLink={setLink}
        />
      )}

      {allowModeToggle && (
        <button
          type="button"
          className="mode-toggle-btn"
          onClick={handleModeToggle}
        >
          {currentMode === 'display' ? 'Edit' : 'View'}
        </button>
      )}

      {isRawMode && isEditable ? (
        <textarea
          className="editor-raw"
          value={rawValue}
          onChange={handleRawChange}
          placeholder={placeholder}
          style={{ minHeight }}
        />
      ) : (
        <EditorContent
          editor={editor}
          className="editor-content"
          style={{ minHeight }}
        />
      )}
    </div>
  )
}
