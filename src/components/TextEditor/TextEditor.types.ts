export type TextFormat = 'md' | 'adoc'
export type EditorMode = 'display' | 'edit'

export interface TextEditorProps {
  /** Content value in original format (md or adoc) */
  value: string

  /** Callback fired when content changes (only in edit mode) */
  onChange?: (value: string) => void

  /** Source format of the content */
  format?: TextFormat

  /** Mode: display (readonly) or edit */
  mode?: EditorMode

  /** Allow toggling between display and edit modes */
  allowModeToggle?: boolean

  /** Callback fired when mode changes */
  onModeChange?: (mode: EditorMode) => void

  /** Placeholder text for empty editor */
  placeholder?: string

  /** Minimum height in pixels */
  minHeight?: number

  /** Additional CSS class */
  className?: string
}
