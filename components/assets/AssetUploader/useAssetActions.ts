'use client'

import { useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { DeleteAssetRequestSchema, type Asset } from '@/gen/centy_pb'
import type { PendingAsset } from './types'

export function useAssetActions(
  projectPath: string,
  targetId: string | undefined,
  onAssetsChange: ((assets: Asset[]) => void) | undefined,
  onPendingChange: ((pending: PendingAsset[]) => void) | undefined,
  pendingAssets: PendingAsset[],
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>,
  setPendingAssets: React.Dispatch<React.SetStateAction<PendingAsset[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
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
          setAssets(prev => {
            const updated = prev.filter(a => a.filename !== filename)
            onAssetsChange?.(updated)
            return updated
          })
        } else {
          setError(response.error || 'Failed to remove asset')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove asset')
      }
    },
    [projectPath, targetId, onAssetsChange, setAssets, setError]
  )

  const removePending = useCallback(
    (pendingId: string) => {
      const pending = pendingAssets.find(p => p.id === pendingId)
      if (pending?.preview) URL.revokeObjectURL(pending.preview)
      setPendingAssets(prev => {
        const updated = prev.filter(p => p.id !== pendingId)
        onPendingChange?.(updated)
        return updated
      })
    },
    [pendingAssets, onPendingChange, setPendingAssets]
  )

  return { removeAsset, removePending }
}
