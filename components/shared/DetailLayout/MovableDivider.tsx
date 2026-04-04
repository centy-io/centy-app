'use client'

import React from 'react'

interface MovableDividerProps {
  onMouseDown: (e: React.MouseEvent) => void
  isDragging: boolean
}

export function MovableDivider({
  onMouseDown,
  isDragging,
}: MovableDividerProps) {
  return (
    <div
      className={`detail-layout-resize-handle${isDragging ? ' is-dragging' : ''}`}
      onMouseDown={onMouseDown}
    >
      <div className="detail-layout-resize-grip" />
    </div>
  )
}
