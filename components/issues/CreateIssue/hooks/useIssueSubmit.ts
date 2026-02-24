import { useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { CreateItemRequestSchema } from '@/gen/centy_pb'
import type {
  AssetUploaderHandle,
  PendingAsset,
} from '@/components/assets/AssetUploader'

interface UseIssueSubmitParams {
  title: string
  description: string
  priority: number
  status: string
  pendingAssets: PendingAsset[]
  assetUploaderRef: React.RefObject<AssetUploaderHandle | null>
  projectPath: string
  submitItem: (
    fn: () => Promise<{
      success: boolean
      error?: string
      id?: string
      issueNumber?: string
    }>,
    e?: React.FormEvent
  ) => Promise<void>
}

export function useIssueSubmit({
  title,
  description,
  priority,
  status,
  pendingAssets,
  assetUploaderRef,
  projectPath,
  submitItem,
}: UseIssueSubmitParams) {
  return useCallback(
    async (e?: React.FormEvent) => {
      if (!title.trim()) return
      return submitItem(async () => {
        const request = create(CreateItemRequestSchema, {
          projectPath: projectPath.trim(),
          itemType: 'issues',
          title: title.trim(),
          body: description.trim(),
          priority,
          status,
        })
        const response = await centyClient.createItem(request)
        if (
          response.success &&
          pendingAssets.length > 0 &&
          assetUploaderRef.current
        ) {
          await assetUploaderRef.current.uploadAllPending(
            response.item ? response.item.id : ''
          )
        }
        return {
          success: response.success,
          error: response.error,
          id: response.item ? response.item.id : undefined,
          issueNumber: response.item ? response.item.id : undefined,
        }
      }, e)
    },
    [
      title,
      description,
      priority,
      status,
      pendingAssets,
      assetUploaderRef,
      projectPath,
      submitItem,
    ]
  )
}
