'use client'

import { useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { DeleteAssetRequestSchema, type Asset } from '@/gen/centy_pb'
import type { PendingAsset } from './types'
import type { useAssetUploader } from './useAssetUploader'

type UploaderState = ReturnType<typeof useAssetUploader>

interface UseAssetRemovalOptions {
  uploader: UploaderState
  projectPath: string
  targetId: string | undefined
  onAssetsChange?: (assets: Asset[]) => void
  onPendingChange?: (pending: PendingAsset[]) => void
}

export function useAssetRemoval({
  uploader,
  projectPath,
  targetId,
  onAssetsChange,
  onPendingChange,
}: UseAssetRemovalOptions) {
  const removeAsset = useCallback(
    async (filename: string) => {
      if (!targetId) return
      try {
        const request = create(DeleteAssetRequestSchema, {
          projectPath,
          issueId: targetId,
          filename,
        })
        const response = await centyClient.deleteAsset(request)
        if (response.success) {
          uploader.setAssets(prev => {
            const updated = prev.filter(a => a.filename !== filename)
            if (onAssetsChange) onAssetsChange(updated)
            return updated
          })
        } else {
          uploader.setError(response.error || 'Failed to remove asset')
        }
      } catch (err) {
        uploader.setError(
          err instanceof Error ? err.message : 'Failed to remove asset'
        )
      }
    },
    [projectPath, targetId, onAssetsChange, uploader]
  )

  const removePending = useCallback(
    (pendingId: string) => {
      const pending = uploader.pendingAssets.find(p => p.id === pendingId)
      if (pending && pending.preview) URL.revokeObjectURL(pending.preview)
      uploader.setPendingAssets(prev => {
        const updated = prev.filter(p => p.id !== pendingId)
        if (onPendingChange) onPendingChange(updated)
        return updated
      })
    },
    [onPendingChange, uploader]
  )

  useEffect(() => {
    return () => {
      uploader.pendingAssets.forEach(p => {
        if (p.preview) URL.revokeObjectURL(p.preview)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { removeAsset, removePending }
}
