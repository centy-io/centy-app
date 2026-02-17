'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { Asset } from '@/gen/centy_pb'
import type { PendingAsset, AssetUploaderProps } from './types'
import { ALLOWED_TYPES, MAX_FILE_SIZE } from './types'
import { useUploadAsset } from './useUploadAsset'
import { useAssetActions } from './useAssetActions'
import { useDragDrop } from './useDragDrop'

export function useAssetUploader({
  projectPath,
  issueId,
  prId,
  onAssetsChange,
  onPendingChange,
  initialAssets = [],
  mode,
}: AssetUploaderProps) {
  const targetId = issueId || prId
  const [assets, setAssets] = useState<Asset[]>(initialAssets)
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initialAssetsKey = JSON.stringify(initialAssets.map(a => a.filename))
  useEffect(() => {
    setAssets(initialAssets)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAssetsKey])

  const uploadAsset = useUploadAsset(
    projectPath,
    onAssetsChange,
    onPendingChange,
    setAssets,
    setPendingAssets
  )

  const { removeAsset, removePending } = useAssetActions(
    projectPath,
    targetId,
    onAssetsChange,
    onPendingChange,
    pendingAssets,
    setAssets,
    setPendingAssets,
    setError
  )

  const validateFile = useCallback((file: File): string | null => {
    if (!Object.keys(ALLOWED_TYPES).includes(file.type)) {
      return `Unsupported file type: ${file.type}`
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max 50MB)`
    }
    return null
  }, [])

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      for (const file of Array.from(files)) {
        const validationError = validateFile(file)
        if (validationError) {
          setError(validationError)
          continue
        }
        const preview = file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : undefined
        const pending: PendingAsset = {
          id: crypto.randomUUID(),
          file,
          preview,
          status: mode === 'edit' && targetId ? 'uploading' : 'pending',
        }
        setPendingAssets(prev => {
          const updated = [...prev, pending]
          onPendingChange?.(updated)
          return updated
        })
        if (mode === 'edit' && targetId) await uploadAsset(pending, targetId)
      }
    },
    [mode, targetId, onPendingChange, validateFile, uploadAsset]
  )

  const uploadAllPending = useCallback(
    async (uploadTargetId: string): Promise<boolean> => {
      let allSuccess = true
      for (const pending of pendingAssets.filter(p => p.status === 'pending')) {
        setPendingAssets(prev =>
          prev.map(p =>
            p.id === pending.id ? { ...p, status: 'uploading' as const } : p
          )
        )
        if (!(await uploadAsset(pending, uploadTargetId))) allSuccess = false
      }
      return allSuccess
    },
    [pendingAssets, uploadAsset]
  )

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
    useDragDrop(handleFiles)

  return {
    assets,
    pendingAssets,
    isDragging,
    error,
    setError,
    fileInputRef,
    handleFiles,
    uploadAllPending,
    removeAsset,
    removePending,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  }
}
