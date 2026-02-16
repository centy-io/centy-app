'use client'

import { useCallback, useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapLink from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import { common, createLowlight } from 'lowlight'
import type { TextEditorProps, EditorMode } from './TextEditor.types'
import { useAsciidocConverter } from './hooks/useAsciidocConverter'
import { markdownToHtml, htmlToMarkdown } from './utils/markdownParser'

const lowlight = createLowlight(common)

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
  const [currentMode, setCurrentMode] = useState<EditorMode>(mode)
  const [isRawMode, setIsRawMode] = useState(false)

  // Convert AsciiDoc to Markdown if needed
  const markdownContent = useAsciidocConverter(value, format)
  const [rawValue, setRawValue] = useState(markdownContent)

  const isEditable = currentMode === 'edit'

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      TiptapLink.extend({
        name: 'customLink',
      }).configure({
        openOnClick: !isEditable, // Allow clicking links in display mode
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: isEditable ? placeholder : '',
      }),
    ],
    content: markdownToHtml(markdownContent),
    editable: isEditable,
    immediatelyRender: false, // Required for Next.js SSR compatibility
    onUpdate: ({ editor }) => {
      if (isEditable && !isRawMode && onChange) {
        const html = editor.getHTML()
        const markdown = htmlToMarkdown(html)
        setRawValue(markdown)
        onChange(markdown)
      }
    },
  })

  // Update editable state when mode changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(currentMode === 'edit')
    }
  }, [editor, currentMode])

  // Sync internal mode with external prop
  useEffect(() => {
    setCurrentMode(mode)
  }, [mode])

  // Update content when value changes
  useEffect(() => {
    if (editor && markdownContent !== rawValue) {
      const html = markdownToHtml(markdownContent)
      editor.commands.setContent(html)
      setRawValue(markdownContent)
    }
  }, [editor, markdownContent, rawValue])

  const handleRawChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setRawValue(newValue)
      onChange?.(newValue)
    },
    [onChange]
  )

  const toggleRawMode = useCallback(() => {
    if (isRawMode && editor) {
      // Switching from raw to WYSIWYG
      editor.commands.setContent(markdownToHtml(rawValue))
    } else if (!isRawMode && editor) {
      // Switching from WYSIWYG to raw
      const html = editor.getHTML()
      setRawValue(htmlToMarkdown(html))
    }
    setIsRawMode(!isRawMode)
  }, [isRawMode, editor, rawValue])

  const handleModeToggle = useCallback(() => {
    const newMode = currentMode === 'display' ? 'edit' : 'display'
    setCurrentMode(newMode)
    onModeChange?.(newMode)
  }, [currentMode, onModeChange])

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('customLink').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return

    if (url === '') {
      editor.chain().focus().extendMarkRange('customLink').unsetLink().run()
      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('customLink')
      .setLink({ href: url })
      .run()
  }, [editor])

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
        <div className="editor-toolbar">
          <div className="toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'active' : ''}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'active' : ''}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive('strike') ? 'active' : ''}
              title="Strikethrough"
            >
              <s>S</s>
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

          <div className="toolbar-separator" />

          <div className="toolbar-group">
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive('heading', { level: 1 }) ? 'active' : ''
              }
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive('heading', { level: 2 }) ? 'active' : ''
              }
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={
                editor.isActive('heading', { level: 3 }) ? 'active' : ''
              }
              title="Heading 3"
            >
              H3
            </button>
          </div>

          <div className="toolbar-separator" />

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
        </div>
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
