import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListSharedAssetsRequestSchema, type Asset } from '@/gen/centy_pb'

export async function fetchSharedAssets(projectPath: string): Promise<Asset[]> {
  const request = create(ListSharedAssetsRequestSchema, {
    projectPath: projectPath.trim(),
  })
  const response = await centyClient.listSharedAssets(request)
  return response.assets
}
