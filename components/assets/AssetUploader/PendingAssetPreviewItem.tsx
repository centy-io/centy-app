'use client'

import type { PendingAsset } from './types'

interface PendingAssetPreviewItemProps {
  pending: PendingAsset
  onRemove: () => void
}

export function PendingAssetPreviewItem({
  pending,
  onRemove,
}: PendingAssetPreviewItemProps) {
  const type = pending.file.type.startsWith('image/')
    ? 'image'
    : pending.file.type.startsWith('video/')
      ? 'video'
      : 'pdf'

  return (
    <div className={`asset-preview pending ${pending.status}`}>
      {type === 'image' && pending.preview ? (
        <img
          src={pending.preview}
          alt={pending.file.name}
          className="asset-preview-image"
        />
      ) : type === 'video' ? (
        <div className="asset-preview-pdf">
          <span className="asset-preview-pdf-icon">VID</span>
          <span className="asset-preview-pdf-name">{pending.file.name}</span>
        </div>
      ) : (
        <div className="asset-preview-pdf">
          <span className="asset-preview-pdf-icon">PDF</span>
          <span className="asset-preview-pdf-name">{pending.file.name}</span>
        </div>
      )}

      {pending.status === 'error' && (
        <div className="asset-error-badge">
          {pending.error || 'Upload failed'}
        </div>
      )}

      <div className="asset-overlay">
        <button className="asset-remove-btn" onClick={onRemove} title="Remove">
          x
        </button>
      </div>
    </div>
  )
}
