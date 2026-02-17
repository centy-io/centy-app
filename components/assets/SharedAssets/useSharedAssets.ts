'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListSharedAssetsRequestSchema,
  IsInitializedRequestSchema,
  type Asset,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { useSharedAssetsActions } from './useSharedAssetsActions'

export function useSharedAssets() {
  const { projectPath, isInitialized, setIsInitialized } = useProject()
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [previewAsset, setPreviewAsset] = useState<{
    asset: Asset
    url: string
  } | null>(null)

  const { handleDelete, handlePreview, closePreview } = useSharedAssetsActions(
    projectPath,
    setAssets,
    setError,
    setDeleteConfirm,
    setDeleting,
    setPreviewAsset,
    previewAsset
  )

  const checkInitialized = useCallback(
    async (path: string) => {
      if (!path.trim()) {
        setIsInitialized(null)
        return
      }
      try {
        const request = create(IsInitializedRequestSchema, {
          projectPath: path.trim(),
        })
        const response = await centyClient.isInitialized(request)
        setIsInitialized(response.initialized)
      } catch {
        setIsInitialized(false)
      }
    },
    [setIsInitialized]
  )

  const fetchAssets = useCallback(async () => {
    if (!projectPath.trim() || isInitialized !== true) return
    setLoading(true)
    setError(null)
    try {
      const request = create(ListSharedAssetsRequestSchema, {
        projectPath: projectPath.trim(),
      })
      const response = await centyClient.listSharedAssets(request)
      setAssets(response.assets)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, isInitialized])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkInitialized(projectPath)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [projectPath, checkInitialized])

  useEffect(() => {
    if (isInitialized === true) {
      fetchAssets()
    }
  }, [isInitialized, fetchAssets])

  useEffect(
    () => () => {
      if (previewAsset?.url) URL.revokeObjectURL(previewAsset.url)
    },
    [previewAsset]
  )

  return {
    projectPath,
    isInitialized,
    assets,
    loading,
    error,
    deleteConfirm,
    setDeleteConfirm,
    deleting,
    previewAsset,
    fetchAssets,
    handleDelete,
    handlePreview,
    closePreview,
  }
}
