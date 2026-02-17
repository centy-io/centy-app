import type { Editor } from '@tiptap/react'

interface ToolbarBlockButtonsProps {
  editor: Editor
  isRawMode: boolean
  toggleRawMode: () => void
  setLink: () => void
}

export function ToolbarBlockButtons({
  editor,
  isRawMode,
  toggleRawMode,
  setLink,
}: ToolbarBlockButtonsProps) {
  return (
    <>
      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'active' : ''}
          title="Bullet List"
        >
          &bull;
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'active' : ''}
          title="Numbered List"
        >
          1.
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'active' : ''}
          title="Blockquote"
        >
          &quot;
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'active' : ''}
          title="Code Block"
        >
          {'{ }'}
        </button>
      </div>

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
    </>
  )
}
