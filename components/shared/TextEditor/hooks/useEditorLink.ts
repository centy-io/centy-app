import { useCallback } from 'react'
import type { Editor } from '@tiptap/react'

export function useEditorLink(editor: Editor | null) {
  const setLink = useCallback(() => {
    if (!editor) return
    const href: unknown = editor.getAttributes('customLink').href
    const previousUrl = typeof href === 'string' ? href : undefined
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

  return { setLink }
}
