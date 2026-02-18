import { useCallback, useState, useEffect } from 'react'
import { useEditor } from '@tiptap/react'
import type { TextEditorProps, EditorMode } from '../TextEditor.types'
import { markdownToHtml, htmlToMarkdown } from '../utils/markdownParser'
import { createEditorExtensions } from '../constants'
import { useAsciidocConverter } from './useAsciidocConverter'

// eslint-disable-next-line max-lines-per-function
export function useTextEditorState({
  value,
  onChange,
  format,
  mode,
  onModeChange,
  placeholder,
}: TextEditorProps) {
  const resolvedFormat = format !== undefined ? format : 'md'
  const resolvedMode = mode !== undefined ? mode : 'edit'
  const resolvedPlaceholder =
    placeholder !== undefined ? placeholder : 'Write your content...'
  const [currentMode, setCurrentMode] = useState<EditorMode>(resolvedMode)
  const [isRawMode, setIsRawMode] = useState(false)

  const markdownContent = useAsciidocConverter(value, resolvedFormat)
  const [rawValue, setRawValue] = useState(markdownContent)

  const isEditable = currentMode === 'edit'

  const editor = useEditor({
    extensions: createEditorExtensions(isEditable, resolvedPlaceholder),
    content: markdownToHtml(markdownContent),
    editable: isEditable,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      if (!isEditable || isRawMode || !onChange) return
      const html = ed.getHTML()
      const markdown = htmlToMarkdown(html)
      setRawValue(markdown)
      onChange(markdown)
    },
  })

  useEffect(() => {
    if (editor) {
      editor.setEditable(currentMode === 'edit')
    }
  }, [editor, currentMode])

  useEffect(() => {
    setCurrentMode(resolvedMode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  useEffect(() => {
    if (!editor || markdownContent === rawValue) return
    const html = markdownToHtml(markdownContent)
    editor.commands.setContent(html)
    setRawValue(markdownContent)
  }, [editor, markdownContent, rawValue])

  const handleRawChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setRawValue(newValue)
      if (onChange) onChange(newValue)
    },
    [onChange]
  )

  const toggleRawMode = useCallback(() => {
    if (isRawMode && editor) {
      editor.commands.setContent(markdownToHtml(rawValue))
    } else if (!isRawMode && editor) {
      const html = editor.getHTML()
      setRawValue(htmlToMarkdown(html))
    }
    setIsRawMode(!isRawMode)
  }, [isRawMode, editor, rawValue])

  const handleModeToggle = useCallback(() => {
    const newMode = currentMode === 'display' ? 'edit' : 'display'
    setCurrentMode(newMode)
    if (onModeChange) onModeChange(newMode)
  }, [currentMode, onModeChange])

  return {
    editor,
    currentMode,
    isEditable,
    isRawMode,
    rawValue,
    handleRawChange,
    toggleRawMode,
    handleModeToggle,
  }
}
