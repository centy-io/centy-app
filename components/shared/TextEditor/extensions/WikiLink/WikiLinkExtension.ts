import { Node, mergeAttributes } from '@tiptap/core'
import type { Node as PMNode } from '@tiptap/pm/model'
import { ReactNodeViewRenderer } from '@tiptap/react'
import Suggestion from '@tiptap/suggestion'
import type { SuggestionOptions } from '@tiptap/suggestion'
import type { WikiLinkItem } from './WikiLinkItem'
import { WikiLinkComponent } from './WikiLinkComponent'
import { createWikiLinkSuggestion } from './WikiLinkSuggestion'

interface WikiLinkOptions {
  fetchItems: (query: string) => Promise<WikiLinkItem[]>
  HTMLAttributes: Record<string, string>
  suggestion: Omit<SuggestionOptions<WikiLinkItem>, 'editor'>
}

export const WikiLinkExtension = Node.create<WikiLinkOptions>({
  name: 'wikilink',
  group: 'inline',
  inline: true,
  selectable: false,
  atom: true,

  addOptions() {
    return {
      fetchItems: () => Promise.resolve([]),
      HTMLAttributes: {},
      suggestion: createWikiLinkSuggestion(() => Promise.resolve([])),
    }
  },

  addAttributes() {
    return {
      id: { default: null },
      label: { default: '' },
      itemType: { default: 'issues' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-wikilink]',
        getAttrs: (el: HTMLElement | string) => {
          if (typeof el === 'string') return false
          return {
            id: el.getAttribute('data-id'),
            label: el.getAttribute('data-label') ?? '',
            itemType: el.getAttribute('data-item-type') ?? 'issues',
          }
        },
      },
    ]
  },

  renderHTML({ node }: { node: PMNode }) {
    const id = String(node.attrs.id ?? '')
    const label = String(node.attrs.label ?? '')
    const itemType = String(node.attrs.itemType ?? '')
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-wikilink': '',
        'data-id': id,
        'data-label': label,
        'data-item-type': itemType,
        class: 'wikilink-node',
      }),
      label || id || '',
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(WikiLinkComponent)
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
