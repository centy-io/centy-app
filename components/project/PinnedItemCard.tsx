'use client'

import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import { useAppLink } from '@/hooks/useAppLink'
import type { PinnedItem } from '@/hooks/usePinnedItems'

interface PinnedItemCardProps {
  item: PinnedItem
  isDragging: boolean
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragEnd: () => void
  onUnpin: () => void
}

function getItemHref(
  item: PinnedItem,
  createLink: (path: string) => RouteLiteral
): RouteLiteral {
  switch (item.type) {
    case 'issue':
      return createLink(`/issues/${item.id}`)
    case 'doc':
      return createLink(`/docs/${item.id}`)
    case 'pr':
      return createLink(`/pull-requests/${item.displayNumber}`)
  }
}

function getTypeBadgeClass(type: PinnedItem['type']): string {
  return `pinned-item-type-badge type-${type}`
}

function getTypeLabel(type: PinnedItem['type']): string {
  switch (type) {
    case 'issue':
      return 'Issue'
    case 'doc':
      return 'Doc'
    case 'pr':
      return 'PR'
  }
}

export function PinnedItemCard({
  item,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
  onUnpin,
}: PinnedItemCardProps) {
  const { createLink } = useAppLink()
  const href = getItemHref(item, createLink)

  return (
    <div
      className={`pinned-item-card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="pinned-item-drag-handle" title="Drag to reorder">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className={getTypeBadgeClass(item.type)}>
        {getTypeLabel(item.type)}
      </span>
      <div className="pinned-item-content">
        <Link href={href} className="pinned-item-link">
          {item.title}
        </Link>
        {item.displayNumber != null && (
          <div className="pinned-item-number">#{item.displayNumber}</div>
        )}
      </div>
      <button
        type="button"
        className="pinned-item-unpin-btn"
        onClick={onUnpin}
        title="Unpin"
      >
        &times;
      </button>
    </div>
  )
}
