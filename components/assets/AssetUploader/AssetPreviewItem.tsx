'use client'

import { useState, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { GetAssetRequestSchema, type Asset } from '@/gen/centy_pb'

interface AssetPreviewItemProps {
  asset: Asset
  projectPath: string
  issueId: string
  onRemove: () => void
}

export function AssetPreviewItem({
  asset,
  projectPath,
  issueId,
  onRemove,
}: AssetPreviewItemProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadPreview = async () => {
      if (
        asset.mimeType.startsWith('image/') ||
        asset.mimeType.startsWith('video/')
      ) {
        try {
          const request = create(GetAssetRequestSchema, {
            projectPath,
            issueId,
            filename: asset.filename,
          })
          const response = await centyClient.getAsset(request)
          if (mounted && response.data) {
            const bytes = new Uint8Array(response.data)
            const blob = new Blob([bytes], { type: asset.mimeType })
            setPreviewUrl(URL.createObjectURL(blob))
          }
        } catch (err) {
          console.error('Failed to load asset preview:', err)
        }
      }
      if (mounted) setLoading(false)
    }
    loadPreview()

    return () => {
      mounted = false
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [asset, projectPath, issueId]) // eslint-disable-line react-hooks/exhaustive-deps

  const type = asset.mimeType.startsWith('image/')
    ? 'image'
    : asset.mimeType.startsWith('video/')
      ? 'video'
      : 'pdf'

  return (
    <div className="asset-preview">
      {loading ? (
        <div className="asset-loading">Loading...</div>
      ) : type === 'image' && previewUrl ? (
        <img
          src={previewUrl}
          alt={asset.filename}
          className="asset-preview-image"
        />
      ) : type === 'video' && previewUrl ? (
        <video src={previewUrl} className="asset-preview-video" muted />
      ) : (
        <div className="asset-preview-pdf">
          <span className="asset-preview-pdf-icon">PDF</span>
          <span className="asset-preview-pdf-name">{asset.filename}</span>
        </div>
      )}
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
