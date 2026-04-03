'use client'

import type { KeyboardEvent } from 'react'

/**
 * Creates a keyboard handler for listbox navigation (ArrowDown/ArrowUp).
 * Shared between ProjectFlatList and ProjectGroupList to avoid duplication.
 */
export function makeListKeyboardHandler(onFocusSearch: () => void) {
  return (e: KeyboardEvent<HTMLElement>) => {
    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>('[role="option"]')
    )
    const activeEl = document.activeElement
    const idx = activeEl instanceof HTMLElement ? items.indexOf(activeEl) : -1

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = items[idx === -1 ? 0 : Math.min(idx + 1, items.length - 1)]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (next) next.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (idx <= 0) {
        onFocusSearch()
      } else {
        const prev = items[idx - 1]
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (prev) prev.focus()
      }
    }
  }
}
