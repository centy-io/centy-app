/**
 * @deprecated Use TextEditor from './TextEditor' instead.
 * This component is kept for backward compatibility.
 *
 * Migration example:
 * ```tsx
 * // Before
 * <MarkdownEditor value={content} onChange={setContent} />
 *
 * // After
 * <TextEditor value={content} onChange={setContent} format="md" mode="edit" />
 * ```
 */
import { TextEditor, type TextEditorProps } from './TextEditor'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
  className?: string
}

/**
 * @deprecated Use TextEditor with format="md" mode="edit" instead
 */
export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  minHeight,
  className,
}: MarkdownEditorProps) {
  return (
    <TextEditor
      value={value}
      onChange={onChange}
      format="md"
      mode="edit"
      placeholder={placeholder}
      minHeight={minHeight}
      className={className}
    />
  )
}

export type { TextEditorProps }
