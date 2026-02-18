'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { Asset } from '@/gen/centy_pb'
import type { PendingAsset } from './types'
import { ALLOWED_TYPES, MAX_FILE_SIZE } from './types'
import { uploadAssetToServer } from './uploadAsset'

interface UseAssetUploaderOptions {
  projectPath: string
  targetId: string | undefined
  onAssetsChange?: (assets: Asset[]) => void
  onPendingChange?: (pending: PendingAsset[]) => void
  initialAssets: Asset[]
  mode: 'create' | 'edit'
}

export function useAssetUploader({
  projectPath,
  onAssetsChange,
  onPendingChange,
  initialAssets,
}: UseAssetUploaderOptions) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets)
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initialAssetsKey = JSON.stringify(initialAssets.map(a => a.filename))
  useEffect(() => {
    setAssets(initialAssets)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAssetsKey])

  const validateFile = useCallback((file: File): string | null => {
    if (!Object.keys(ALLOWED_TYPES).includes(file.type)) {
      return `Unsupported file type: ${file.type}`
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max 50MB)`
    }
    return null
  }, [])

  const uploadAsset = useCallback(
    async (pending: PendingAsset, uploadTargetId: string): Promise<boolean> => {
      const result = await uploadAssetToServer(
        pending,
        uploadTargetId,
        projectPath
      )
      if (result.success && result.asset) {
        setAssets(prev => {
          const updated = [...prev, result.asset!]
          if (onAssetsChange) onAssetsChange(updated)
          return updated
        })
        setPendingAssets(prev => {
          const updated = prev.filter(p => p.id !== pending.id)
          if (onPendingChange) onPendingChange(updated)
          return updated
        })
        return true
      }
      setPendingAssets(prev =>
        prev.map(p =>
          p.id === pending.id
            ? { ...p, status: 'error' as const, error: result.error }
            : p
        )
      )
      return false
    },
    [projectPath, onAssetsChange, onPendingChange]
  )

  return {
    assets,
    setAssets,
    pendingAssets,
    setPendingAssets,
    error,
    setError,
    fileInputRef,
    validateFile,
    uploadAsset,
  }
}
