'use client'

import { useState, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { GetAssetRequestSchema, type Asset } from '@/gen/centy_pb'

export function useAssetPreview(
  asset: Asset,
  projectPath: string,
  issueId: string
) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const previewUrlRef = useRef(previewUrl)
  previewUrlRef.current = previewUrl

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
    void loadPreview()

    return () => {
      mounted = false
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [asset, projectPath, issueId])

  const type = asset.mimeType.startsWith('image/')
    ? 'image'
    : asset.mimeType.startsWith('video/')
      ? 'video'
      : 'pdf'

  return { previewUrl, loading, type }
}
