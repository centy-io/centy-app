'use client'

import { useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  DeleteAssetRequestSchema,
  GetAssetRequestSchema,
  type Asset,
} from '@/gen/centy_pb'

export function useSharedAssetsActions(
  projectPath: string,
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setDeleteConfirm: React.Dispatch<React.SetStateAction<string | null>>,
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>,
  setPreviewAsset: React.Dispatch<
    React.SetStateAction<{ asset: Asset; url: string } | null>
  >,
  previewAsset: { asset: Asset; url: string } | null
) {
  const handleDelete = useCallback(
    async (filename: string) => {
      if (!projectPath) return
      setDeleting(true)
      setError(null)
      try {
        const request = create(DeleteAssetRequestSchema, {
          projectPath,
          filename,
          isShared: true,
        })
        const response = await centyClient.deleteAsset(request)
        if (response.success) {
          setAssets(prev => prev.filter(a => a.filename !== filename))
          setDeleteConfirm(null)
        } else {
          setError(response.error || 'Failed to delete asset')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setDeleting(false)
      }
    },
    [projectPath, setAssets, setError, setDeleteConfirm, setDeleting]
  )

  const handlePreview = useCallback(
    async (asset: Asset) => {
      if (!projectPath) return
      try {
        const request = create(GetAssetRequestSchema, {
          projectPath,
          filename: asset.filename,
          isShared: true,
        })
        const response = await centyClient.getAsset(request)
        if (response.success && response.data) {
          const bytes = new Uint8Array(response.data)
          const blob = new Blob([bytes], { type: asset.mimeType })
          const url = URL.createObjectURL(blob)
          setPreviewAsset({ asset, url })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load asset')
      }
    },
    [projectPath, setPreviewAsset, setError]
  )

  const closePreview = useCallback(() => {
    if (previewAsset?.url) {
      URL.revokeObjectURL(previewAsset.url)
    }
    setPreviewAsset(null)
  }, [previewAsset, setPreviewAsset])

  return { handleDelete, handlePreview, closePreview }
}
