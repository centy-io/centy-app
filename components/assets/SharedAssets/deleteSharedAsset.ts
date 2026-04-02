import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { DeleteAssetRequestSchema } from '@/gen/centy_pb'

export async function deleteSharedAsset(
  projectPath: string,
  filename: string
): Promise<{ success: boolean; error?: string }> {
  const request = create(DeleteAssetRequestSchema, {
    projectPath,
    filename,
    isShared: true,
  })
  const response = await centyClient.deleteAsset(request)
  return {
    success: response.success,
    error: response.error || undefined,
  }
}
