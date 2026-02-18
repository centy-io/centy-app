'use client'

import type { RefObject } from 'react'

interface DropZoneProps {
  isDragging: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onFilesSelected: (files: FileList) => void
}

export function DropZone({
  isDragging,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFilesSelected,
}: DropZoneProps) {
  return (
    <div
      className={`drop-zone ${isDragging ? 'dragging' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => {
        if (fileInputRef.current) fileInputRef.current.click()
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm,application/pdf"
        onChange={e => {
          if (e.target.files) onFilesSelected(e.target.files)
        }}
        style={{ display: 'none' }}
      />
      <div className="drop-zone-content">
        <span className="drop-zone-icon">+</span>
        <span className="drop-zone-text">
          {isDragging
            ? 'Drop files here...'
            : 'Drag & drop files or click to browse'}
        </span>
        <span className="drop-zone-hint">
          Images, videos, or PDFs (max 50MB)
        </span>
      </div>
    </div>
  )
}
