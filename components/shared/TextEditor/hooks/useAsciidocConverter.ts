import { useMemo } from 'react'
import downdoc from 'downdoc'
import type { TextFormat } from '../TextEditor.types'

export function useAsciidocConverter(
  content: string,
  format: TextFormat
): string {
  return useMemo(() => {
    if (format === 'adoc') {
      try {
        return downdoc(content)
      } catch (error) {
        console.error('Failed to convert AsciiDoc:', error)
        return content // Fallback to raw content
      }
    }
    return content
  }, [content, format])
}
