import { ReactRenderer } from '@tiptap/react'
import type { Editor } from '@tiptap/core'
import type { Range } from '@tiptap/core'
import type { SuggestionOptions } from '@tiptap/suggestion'
import type { WikiLinkItem } from './WikiLinkItem'
import { WikiLinkPopup } from './WikiLinkPopup'
import type { WikiLinkPopupRef } from './WikiLinkPopup'

export function createWikiLinkSuggestion(
  fetchItems: (query: string) => Promise<WikiLinkItem[]>
): Omit<SuggestionOptions<WikiLinkItem>, 'editor'> {
  return {
    char: '[[',
    allowSpaces: true,

    items: async ({ query }) => {
      try {
        return await fetchItems(query)
      } catch {
        return []
      }
    },

    command: ({
      editor,
      range,
      props,
    }: {
      editor: Editor
      range: Range
      props: WikiLinkItem
    }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'wikilink',
          attrs: {
            id: props.id,
            label: props.label,
            itemType: props.itemType,
          },
        })
        .insertContent(' ')
        .run()
    },

    render: () => {
      let component: ReactRenderer<WikiLinkPopupRef> | null = null
      let popupEl: HTMLElement | null = null

      return {
        onStart: props => {
          popupEl = document.createElement('div')
          popupEl.style.position = 'absolute'
          popupEl.style.zIndex = '9999'
          document.body.appendChild(popupEl)

          component = new ReactRenderer(WikiLinkPopup, {
            props,
            editor: props.editor,
          })
          popupEl.appendChild(component.element)
        },

        onUpdate: props => {
          component?.updateProps(props)
        },

        onKeyDown: ({ event }) => {
          if (event.key === 'Escape') {
            popupEl?.remove()
            component?.destroy()
            component = null
            popupEl = null
            return true
          }
          return component?.ref?.onKeyDown({ event }) ?? false
        },

        onExit: () => {
          popupEl?.remove()
          component?.destroy()
          component = null
          popupEl = null
        },
      }
    },
  }
}
