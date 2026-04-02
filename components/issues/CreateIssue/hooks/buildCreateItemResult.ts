import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { CreateItemRequestSchema } from '@/gen/centy_pb'
import type {
  AssetUploaderHandle,
  PendingAsset,
} from '@/components/assets/AssetUploader'

interface CreateIssuePayload {
  projectPath: string
  title: string
  description: string
  priority: number
  status: string
  pendingAssets: PendingAsset[]
  assetUploaderRef: React.RefObject<AssetUploaderHandle | null>
}

export async function buildCreateItemResult(payload: CreateIssuePayload) {
  const request = create(CreateItemRequestSchema, {
    projectPath: payload.projectPath.trim(),
    itemType: 'issues',
    title: payload.title.trim(),
    body: payload.description.trim(),
    priority: payload.priority,
    status: payload.status,
  })
  const response = await centyClient.createItem(request)
  if (
    response.success &&
    payload.pendingAssets.length > 0 &&
    payload.assetUploaderRef.current
  ) {
    await payload.assetUploaderRef.current.uploadAllPending(
      response.item ? response.item.id : ''
    )
  }
  return {
    success: response.success,
    error: response.error,
    id: response.item ? response.item.id : undefined,
    issueNumber: response.item ? response.item.id : undefined,
  }
}
