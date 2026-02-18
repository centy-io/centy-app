'use client'

import { useCallback, useImperativeHandle } from 'react'
import type { ForwardedRef } from 'react'
import type { AssetUploaderHandle, PendingAsset } from './types'
import type { useAssetUploader } from './useAssetUploader'

type UploaderState = ReturnType<typeof useAssetUploader>

interface UseAssetHandlersOptions {
  uploader: UploaderState
  targetId: string | undefined
  mode: 'create' | 'edit'
  onPendingChange?: (pending: PendingAsset[]) => void
  ref: ForwardedRef<AssetUploaderHandle>
}

export function useAssetHandlers({
  uploader,
  targetId,
  mode,
  onPendingChange,
  ref,
}: UseAssetHandlersOptions) {
  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      for (const file of Array.from(files)) {
        const validationError = uploader.validateFile(file)
        if (validationError) {
          uploader.setError(validationError)
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
        uploader.setPendingAssets(prev => {
          const updated = [...prev, pending]
          if (onPendingChange) onPendingChange(updated)
          return updated
        })
        if (mode === 'edit' && targetId) {
          await uploader.uploadAsset(pending, targetId)
        }
      }
    },
    [mode, targetId, onPendingChange, uploader]
  )

  const uploadAllPending = useCallback(
    async (uploadTargetId: string): Promise<boolean> => {
      let allSuccess = true
      for (const pending of uploader.pendingAssets.filter(
        p => p.status === 'pending'
      )) {
        uploader.setPendingAssets(prev =>
          prev.map(p =>
            p.id === pending.id ? { ...p, status: 'uploading' as const } : p
          )
        )
        if (!(await uploader.uploadAsset(pending, uploadTargetId)))
          allSuccess = false
      }
      return allSuccess
    },
    [uploader]
  )

  useImperativeHandle(ref, () => ({ uploadAllPending }))

  return { handleFiles }
}
