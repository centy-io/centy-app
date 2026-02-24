import { useCallback, useState, useEffect } from 'react'
import { useEditor, type Editor } from '@tiptap/react'
import type { TextEditorProps, EditorMode } from '../TextEditor.types'
import { markdownToHtml, htmlToMarkdown } from '../utils/markdownParser'
import { createEditorExtensions } from '../constants'
import { useAsciidocConverter } from './useAsciidocConverter'

function useSyncEditorContent(
  editor: Editor | null,
  markdownContent: string,
  rawValue: string,
  setRawValue: React.Dispatch<React.SetStateAction<string>>
) {
  useEffect(() => {
    if (!editor || markdownContent === rawValue) return
    const html = markdownToHtml(markdownContent)
    editor.commands.setContent(html)
    setRawValue(markdownContent)
  }, [editor, markdownContent, rawValue, setRawValue])
}

function useModeSync(
  editor: Editor | null,
  resolvedMode: EditorMode,
  onModeChange: ((mode: EditorMode) => void) | undefined
) {
  const [currentMode, setCurrentMode] = useState<EditorMode>(resolvedMode)

  useEffect(() => {
    if (editor) editor.setEditable(currentMode === 'edit')
  }, [editor, currentMode])

  useEffect(() => {
    setCurrentMode(resolvedMode)
  }, [resolvedMode])

  const handleModeToggle = useCallback(() => {
    const newMode = currentMode === 'display' ? 'edit' : 'display'
    setCurrentMode(newMode)
    if (onModeChange) onModeChange(newMode)
  }, [currentMode, onModeChange])

  return { currentMode, handleModeToggle }
}

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
  const [isRawMode, setIsRawMode] = useState(false)

  const markdownContent = useAsciidocConverter(value, resolvedFormat)
  const [rawValue, setRawValue] = useState(markdownContent)

  const isEditable = resolvedMode === 'edit'

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

  const { currentMode, handleModeToggle } = useModeSync(
    editor,
    resolvedMode,
    onModeChange
  )

  useSyncEditorContent(editor, markdownContent, rawValue, setRawValue)

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

  return {
    editor,
    currentMode,
    isEditable: currentMode === 'edit',
    isRawMode,
    rawValue,
    handleRawChange,
    toggleRawMode,
    handleModeToggle,
  }
}
