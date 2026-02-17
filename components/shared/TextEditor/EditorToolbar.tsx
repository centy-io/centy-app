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

      <ToolbarBlockButtons
        editor={editor}
        isRawMode={isRawMode}
        toggleRawMode={toggleRawMode}
        setLink={setLink}
      />
    </div>
  )
}
