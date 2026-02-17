import StarterKit from '@tiptap/starter-kit'
import TiptapLink from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import { common, createLowlight } from 'lowlight'

const lowlight = createLowlight(common)

export function buildEditorExtensions(
  isEditable: boolean,
  placeholder: string
) {
  return [
    StarterKit.configure({
      codeBlock: false,
    }),
    TiptapLink.extend({
      name: 'customLink',
    }).configure({
      openOnClick: !isEditable,
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
  ]
}
