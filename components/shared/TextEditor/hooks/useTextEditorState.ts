import { useCallback, useState, useEffect } from 'react'
import { useEditor } from '@tiptap/react'
import type { TextEditorProps, EditorMode } from '../TextEditor.types'
import { useAsciidocConverter } from './useAsciidocConverter'
import { useEditorLink } from './useEditorLink'
import { markdownToHtml, htmlToMarkdown } from '../utils/markdownParser'
import { buildEditorExtensions } from '../constants'

export function useTextEditorState({
  value,
  onChange,
  format = 'md',
  mode = 'edit',
  onModeChange,
  placeholder = 'Write your content...',
}: Pick<
  TextEditorProps,
  'value' | 'onChange' | 'format' | 'mode' | 'onModeChange' | 'placeholder'
>) {
  const [currentMode, setCurrentMode] = useState<EditorMode>(mode)
  const [isRawMode, setIsRawMode] = useState(false)

  const markdownContent = useAsciidocConverter(value, format)
  const [rawValue, setRawValue] = useState(markdownContent)

  const isEditable = currentMode === 'edit'

  const editor = useEditor({
    extensions: buildEditorExtensions(isEditable, placeholder),
    content: markdownToHtml(markdownContent),
    editable: isEditable,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      if (isEditable && !isRawMode && onChange) {
        const html = ed.getHTML()
        const markdown = htmlToMarkdown(html)
        setRawValue(markdown)
        onChange(markdown)
      }
    },
  })

  useEffect(() => {
    if (editor) {
      editor.setEditable(currentMode === 'edit')
    }
  }, [editor, currentMode])

  useEffect(() => {
    setCurrentMode(mode)
  }, [mode])

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
    onModeChange?.(newMode)
  }, [currentMode, onModeChange])

  const setLink = useEditorLink(editor)

  return {
    editor,
    currentMode,
    isEditable,
    isRawMode,
    rawValue,
    handleRawChange,
    toggleRawMode,
    handleModeToggle,
    setLink,
  }
}
