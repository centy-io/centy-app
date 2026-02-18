'use client'

import type { Asset } from '@/gen/centy_pb'

interface PreviewModalProps {
  asset: Asset
  url: string
  onClose: () => void
}

export function PreviewModal({ asset, url, onClose }: PreviewModalProps) {
  return (
    <div className="preview-modal" onClick={onClose}>
      <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
        <button className="preview-close-btn" onClick={onClose}>
          x
        </button>
        <h3>{asset.filename}</h3>
        {asset.mimeType.startsWith('image/') ? (
          <img src={url} alt={asset.filename} />
        ) : asset.mimeType.startsWith('video/') ? (
          <video src={url} controls />
        ) : (
          <div className="preview-download">
            <a href={url} download={asset.filename}>
              Download File
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
