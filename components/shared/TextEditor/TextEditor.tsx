'use client'

import { EditorContent } from '@tiptap/react'
import type { TextEditorProps } from './TextEditor.types'
import { useTextEditorState } from './hooks/useTextEditorState'
import { useEditorLink } from './hooks/useEditorLink'
import { EditorToolbar } from './EditorToolbar'

export function TextEditor(props: TextEditorProps) {
  const {
    minHeight = 200,
    className = '',
    allowModeToggle = false,
    placeholder = 'Write your content...',
  } = props

  const state = useTextEditorState(props)
  const { setLink } = useEditorLink(state.editor)

  if (!state.editor) {
    return null
  }

  const editorClassName = [
    'text-editor',
    `text-editor--${state.currentMode}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={editorClassName}>
      {state.isEditable && (
        <EditorToolbar
          editor={state.editor}
          isRawMode={state.isRawMode}
          toggleRawMode={state.toggleRawMode}
          setLink={setLink}
        />
      )}

      {allowModeToggle && (
        <button
          type="button"
          className="mode-toggle-btn"
          onClick={state.handleModeToggle}
        >
          {state.currentMode === 'display' ? 'Edit' : 'View'}
        </button>
      )}

      {state.isRawMode && state.isEditable ? (
        <textarea
          className="editor-raw"
          value={state.rawValue}
          onChange={state.handleRawChange}
          placeholder={placeholder}
          style={{ minHeight }}
        />
      ) : (
        <EditorContent
          editor={state.editor}
          className="editor-content"
          style={{ minHeight }}
        />
      )}
    </div>
  )
}
