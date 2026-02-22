'use client'

import { useState, type RefObject } from 'react'

interface DropZoneProps {
  fileInputRef: RefObject<HTMLInputElement | null>
  onFilesSelected: (files: FileList) => void
}

export function DropZone({ fileInputRef, onFilesSelected }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  return (
    <div
      className={`drop-zone ${isDragging ? 'dragging' : ''}`}
      onDragOver={e => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={e => {
        e.preventDefault()
        setIsDragging(false)
      }}
      onDrop={e => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files.length > 0) {
          onFilesSelected(e.dataTransfer.files)
        }
      }}
      onClick={() => {
        if (fileInputRef.current) fileInputRef.current.click()
      }}
    >
      <input
        className="drop-zone-input"
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
