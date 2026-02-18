import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { AddAssetRequestSchema, type Asset } from '@/gen/centy_pb'
import type { PendingAsset } from './types'

interface UploadResult {
  success: boolean
  asset?: Asset
  error?: string
}

/**
 * Upload a single pending asset to the server
 */
export async function uploadAssetToServer(
  pending: PendingAsset,
  uploadTargetId: string,
  projectPath: string
): Promise<UploadResult> {
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
      if (pending.preview) URL.revokeObjectURL(pending.preview)
      return { success: true, asset: response.asset }
    }
    return {
      success: false,
      error: response.error || 'Upload failed',
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Upload failed',
    }
  }
}
