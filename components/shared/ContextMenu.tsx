'use client'

import { FloatingPortal } from '@floating-ui/react'
import { useContextMenuDismiss } from './useContextMenuDismiss'
import { getContextMenuPosition } from './getContextMenuPosition'
import type { ContextMenuProps } from './ContextMenu.types'
import '@/styles/components/ContextMenu.css'

export function ContextMenu({ items, x, y, onClose }: ContextMenuProps) {
  const menuRef = useContextMenuDismiss(onClose)
  const adjustedPosition = getContextMenuPosition(x, y, items.length)

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
