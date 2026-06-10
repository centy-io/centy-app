import { ReactRenderer } from '@tiptap/react'
import type { Editor } from '@tiptap/core'
import type { Range } from '@tiptap/core'
import type { SuggestionOptions } from '@tiptap/suggestion'
import type { WikiLinkItem } from './WikiLinkItem'
import { WikiLinkPopup } from './WikiLinkPopup'
import type { WikiLinkPopupRef } from './WikiLinkPopup'

function createWikiLinkRender(): NonNullable<
  SuggestionOptions<WikiLinkItem>['render']
> {
  return () => {
    let component: ReactRenderer<WikiLinkPopupRef> | null = null
    let popupEl: HTMLElement | null = null

    const cleanup = () => {
      popupEl?.remove()
      component?.destroy()
      component = null
      popupEl = null
    }

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
          cleanup()
          return true
        }
        return component?.ref?.onKeyDown({ event }) ?? false
      },
      onExit: cleanup,
    }
  }
}

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
          attrs: { id: props.id, label: props.label, itemType: props.itemType },
        })
        .insertContent(' ')
        .run()
    },
    render: createWikiLinkRender(),
  }
}
