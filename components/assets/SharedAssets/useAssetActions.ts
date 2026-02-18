'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Asset } from '@/gen/centy_pb'
import { deleteSharedAsset, loadAssetPreview } from './sharedAssetsApi'

interface PreviewAsset {
  asset: Asset
  url: string
}

export function useAssetActions(
  projectPath: string,
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [previewAsset, setPreviewAsset] = useState<PreviewAsset | null>(null)

  const handleDelete = useCallback(
    async (filename: string) => {
      if (!projectPath) return
      setDeleting(true)
      setError(null)
      try {
        const result = await deleteSharedAsset(projectPath, filename)
        if (result.success) {
          setAssets(prev => prev.filter(a => a.filename !== filename))
          setDeleteConfirm(null)
        } else {
          setError(result.error || 'Failed to delete asset')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setDeleting(false)
      }
    },
    [projectPath, setAssets, setError]
  )

  const handlePreview = useCallback(
    async (asset: Asset) => {
      if (!projectPath) return
      try {
        const url = await loadAssetPreview(projectPath, asset)
        if (url) setPreviewAsset({ asset, url })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load asset')
      }
    },
    [projectPath, setError]
  )

  const closePreview = useCallback(() => {
    if (previewAsset && previewAsset.url) URL.revokeObjectURL(previewAsset.url)
    setPreviewAsset(null)
  }, [previewAsset])

  useEffect(() => {
    return () => {
      if (previewAsset && previewAsset.url)
        URL.revokeObjectURL(previewAsset.url)
    }
  }, [previewAsset])

  return {
    deleteConfirm,
    setDeleteConfirm,
    deleting,
    previewAsset,
    handleDelete,
    handlePreview,
    closePreview,
  }
}
