import StarterKit from '@tiptap/starter-kit'
import TiptapLink from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import { common, createLowlight } from 'lowlight'
import { WikiLinkExtension } from './extensions/WikiLink/WikiLinkExtension'
import { createWikiLinkSuggestion } from './extensions/WikiLink/WikiLinkSuggestion'
import type { WikiLinkItem } from './extensions/WikiLink/WikiLinkItem'

const lowlight = createLowlight(common)

export function createEditorExtensions(
  isEditable: boolean,
  placeholder: string,
  fetchWikiLinkItems?: (query: string) => Promise<WikiLinkItem[]>
) {
  const resolvedFetchItems = fetchWikiLinkItems ?? (() => Promise.resolve([]))
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
    WikiLinkExtension.configure({
      fetchItems: resolvedFetchItems,
      suggestion: createWikiLinkSuggestion(resolvedFetchItems),
    }),
  ]
}
