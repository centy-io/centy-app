'use client'

import { useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { AddAssetRequestSchema, type Asset } from '@/gen/centy_pb'
import type { PendingAsset } from './types'

export function useUploadAsset(
  projectPath: string,
  onAssetsChange: ((assets: Asset[]) => void) | undefined,
  onPendingChange: ((pending: PendingAsset[]) => void) | undefined,
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>,
  setPendingAssets: React.Dispatch<React.SetStateAction<PendingAsset[]>>
) {
  const uploadAsset = useCallback(
    async (pending: PendingAsset, uploadTargetId: string): Promise<boolean> => {
      try {
        const arrayBuffer = await pending.file.arrayBuffer()
        const request = create(AddAssetRequestSchema, {
          projectPath,
          issueId: uploadTargetId,
          filename: pending.file.name,
          data: new Uint8Array(arrayBuffer),
        })
        const response = await centyClient.addAsset(request)

        if (response.success && response.asset) {
          setAssets(prev => {
            const updated = [...prev, response.asset!]
            onAssetsChange?.(updated)
            return updated
          })
          setPendingAssets(prev => {
            const updated = prev.filter(p => p.id !== pending.id)
            onPendingChange?.(updated)
            return updated
          })
          if (pending.preview) URL.revokeObjectURL(pending.preview)
          return true
        } else {
          setPendingAssets(prev =>
            prev.map(p =>
              p.id === pending.id
                ? {
                    ...p,
                    status: 'error' as const,
                    error: response.error || 'Upload failed',
                  }
                : p
            )
          )
          return false
        }
      } catch (err) {
        setPendingAssets(prev =>
          prev.map(p =>
            p.id === pending.id
              ? {
                  ...p,
                  status: 'error' as const,
                  error: err instanceof Error ? err.message : 'Upload failed',
                }
              : p
          )
        )
        return false
      }
    },
    [projectPath, onAssetsChange, onPendingChange, setAssets, setPendingAssets]
  )

  return uploadAsset
}
