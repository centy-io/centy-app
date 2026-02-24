import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { GetAssetRequestSchema, type Asset } from '@/gen/centy_pb'

export async function loadAssetPreview(
  projectPath: string,
  asset: Asset
): Promise<string | null> {
  const request = create(GetAssetRequestSchema, {
    projectPath,
    filename: asset.filename,
    isShared: true,
  })
  const response = await centyClient.getAsset(request)
  if (response.success && response.data) {
    const bytes = new Uint8Array(response.data)
    const blob = new Blob([bytes], { type: asset.mimeType })
    return URL.createObjectURL(blob)
  }
  return null
}
