'use client'

import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from 'react'
import type { WikiLinkItem } from './WikiLinkItem'

export interface WikiLinkPopupRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

interface WikiLinkPopupProps {
  items: WikiLinkItem[]
  command: (item: WikiLinkItem) => void
  clientRect?: (() => DOMRect | null) | null
}

export const WikiLinkPopup = forwardRef<WikiLinkPopupRef, WikiLinkPopupProps>(
  ({ items, command, clientRect }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      setSelectedIndex(0)
    }, [items])

    useEffect(() => {
      if (!containerRef.current || !clientRect) return
      const rect = clientRect()
      if (!rect) return
      const el = containerRef.current
      el.style.top = `${rect.bottom + window.scrollY + 4}px`
      el.style.left = `${rect.left + window.scrollX}px`
    }, [clientRect, items])

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex(prev => (prev <= 0 ? items.length - 1 : prev - 1))
          return true
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex(prev => (prev + 1) % items.length)
          return true
        }
        if (event.key === 'Enter') {
          const item = items.at(selectedIndex)
          if (item !== undefined) command(item)
          return true
        }
        return false
      },
    }))

    if (!items.length) return null

    return (
      <div ref={containerRef} className="wikilink-popup">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={`wikilink-popup-item${i === selectedIndex ? ' is-selected' : ''}`}
            onMouseDown={e => {
              e.preventDefault()
              command(item)
            }}
          >
            <span className="wikilink-popup-item-type">{item.itemType}</span>
            {item.displayNumber !== undefined
              ? ` #${item.displayNumber} `
              : ' '}
            <span className="wikilink-popup-item-label">{item.label}</span>
          </button>
        ))}
      </div>
    )
  }
)

WikiLinkPopup.displayName = 'WikiLinkPopup'
