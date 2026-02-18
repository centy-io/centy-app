/* eslint-disable max-lines */
'use client'

import { useEffect, useRef } from 'react'
import { FloatingPortal } from '@floating-ui/react'
import '@/styles/components/ContextMenu.css'

export interface ContextMenuItem {
  label: string
  icon?: string
  onClick: () => void
  danger?: boolean
  disabled?: boolean
}

export interface ContextMenuProps {
  items: ContextMenuItem[]
  x: number
  y: number
  onClose: () => void
}

function useContextMenuDismiss(onClose: () => void) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        onClose()
      }
    }

    // Use timeout to avoid closing immediately on the same click that opened it
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Close on scroll
  useEffect(() => {
    const handleScroll = () => {
      onClose()
    }

    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [onClose])

  return menuRef
}

function getAdjustedPosition(x: number, y: number, itemCount: number) {
  const adjustedPosition = { left: x, top: y }

  if (typeof window !== 'undefined') {
    const menuWidth = 180 // Approximate width
    const menuHeight = itemCount * 36 + 16 // Approximate height

    if (x + menuWidth > window.innerWidth) {
      adjustedPosition.left = window.innerWidth - menuWidth - 8
    }

    if (y + menuHeight > window.innerHeight) {
      adjustedPosition.top = window.innerHeight - menuHeight - 8
    }
  }

  return adjustedPosition
}

export function ContextMenu({ items, x, y, onClose }: ContextMenuProps) {
  const menuRef = useContextMenuDismiss(onClose)
  const adjustedPosition = getAdjustedPosition(x, y, items.length)

  return (
    <FloatingPortal>
      <div
        ref={menuRef}
        className="context-menu"
        style={{
          position: 'fixed',
          left: adjustedPosition.left,
          top: adjustedPosition.top,
        }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            className={`context-menu-item ${item.danger ? 'danger' : ''} ${item.disabled ? 'disabled' : ''}`}
            onClick={() => {
              if (item.disabled) return
              item.onClick()
              onClose()
            }}
            disabled={item.disabled}
          >
            {item.icon && (
              <span className="context-menu-icon">{item.icon}</span>
            )}
            <span className="context-menu-label">{item.label}</span>
          </button>
        ))}
      </div>
    </FloatingPortal>
  )
}
