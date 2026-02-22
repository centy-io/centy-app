'use client'

import { useState } from 'react'
import { PinnedItemCard } from '@/components/project/PinnedItemCard'
import type { PinnedItem } from '@/hooks/usePinnedItems'

interface PinnedItemsSectionProps {
  items: PinnedItem[]
  onUnpin: (id: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

export function PinnedItemsSection({
  items,
  onUnpin,
  onReorder,
}: PinnedItemsSectionProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    onReorder(draggedIndex, index)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className="pinned-items-section">
      <div className="pinned-items-header">
        <h2 className="pinned-items-title">Pinned</h2>
        {items.length > 0 && (
          <span className="pinned-items-count">{items.length}</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="pinned-items-empty">
          <p className="pinned-items-empty-text">No pinned items yet</p>
          <p className="pinned-items-hint">
            Right-click an issue or doc to pin it here for quick access
          </p>
        </div>
      ) : (
        <div className="pinned-items-grid">
          {items.map((item, index) => (
            <PinnedItemCard
              key={item.id}
              item={item}
              isDragging={draggedIndex === index}
              onDragStart={() => handleDragStart(index)}
              onDragOver={e => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onUnpin={() => onUnpin(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
