'use client'

import type { Asset } from '@/gen/centy_pb'

interface SharedAssetCardProps {
  asset: Asset
  deleteConfirm: string | null
  deleting: boolean
  onPreview: (asset: Asset) => void
  onDeleteConfirm: (filename: string | null) => void
  onDelete: (filename: string) => void
  formatFileSize: (bytes: bigint | number) => string
}

export function SharedAssetCard({
  asset,
  deleteConfirm,
  deleting,
  onPreview,
  onDeleteConfirm,
  onDelete,
  formatFileSize,
}: SharedAssetCardProps) {
  return (
    <div className="asset-card">
      <div className="asset-preview" onClick={() => onPreview(asset)}>
        {asset.mimeType.startsWith('image/') ? (
          <div className="preview-placeholder image">IMG</div>
        ) : asset.mimeType.startsWith('video/') ? (
          <div className="preview-placeholder video">VID</div>
        ) : (
          <div className="preview-placeholder file">FILE</div>
        )}
      </div>
      <div className="asset-info">
        <span className="asset-filename" title={asset.filename}>
          {asset.filename}
        </span>
        <div className="asset-meta">
          <span className="asset-size">{formatFileSize(asset.size)}</span>
          <span className="asset-type">{asset.mimeType}</span>
        </div>
      </div>
      <button
        className="asset-delete-btn"
        onClick={e => {
          e.stopPropagation()
          onDeleteConfirm(asset.filename)
        }}
        title="Delete asset"
      >
        x
      </button>
      {deleteConfirm === asset.filename && (
        <div className="delete-confirm-overlay">
          <p className="delete-confirm-message">
            Delete &ldquo;{asset.filename}&rdquo;?
          </p>
          <div className="delete-confirm-actions">
            <button
              onClick={() => onDeleteConfirm(null)}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(asset.filename)}
              disabled={deleting}
              className="confirm-delete-btn"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
