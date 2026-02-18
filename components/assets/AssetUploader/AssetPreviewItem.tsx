'use client'

import { useAssetPreview } from './useAssetPreview'
import type { Asset } from '@/gen/centy_pb'

interface AssetPreviewItemProps {
  asset: Asset
  projectPath: string
  issueId: string
  onRemove: () => void
}

function AssetPreviewContent({
  loading,
  type,
  previewUrl,
  filename,
}: {
  loading: boolean
  type: string
  previewUrl: string | null
  filename: string
}) {
  if (loading) return <div className="asset-loading">Loading...</div>
  if (type === 'image' && previewUrl) {
    return (
      <img src={previewUrl} alt={filename} className="asset-preview-image" />
    )
  }
  if (type === 'video' && previewUrl) {
    return <video src={previewUrl} className="asset-preview-video" muted />
  }
  return (
    <div className="asset-preview-pdf">
      <span className="asset-preview-pdf-icon">PDF</span>
      <span className="asset-preview-pdf-name">{filename}</span>
    </div>
  )
}

export function AssetPreviewItem({
  asset,
  projectPath,
  issueId,
  onRemove,
}: AssetPreviewItemProps) {
  const { previewUrl, loading, type } = useAssetPreview(
    asset,
    projectPath,
    issueId
  )

  return (
    <div className="asset-preview">
      <AssetPreviewContent
        loading={loading}
        type={type}
        previewUrl={previewUrl}
        filename={asset.filename}
      />
      <div className="asset-overlay">
        <button
          className="asset-remove-btn"
          onClick={onRemove}
          title="Remove asset"
        >
          x
        </button>
      </div>
    </div>
  )
}
