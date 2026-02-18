import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListSharedAssetsRequestSchema,
  DeleteAssetRequestSchema,
  GetAssetRequestSchema,
  IsInitializedRequestSchema,
  type Asset,
} from '@/gen/centy_pb'

export async function checkProjectInitialized(
  projectPath: string
): Promise<boolean> {
  const request = create(IsInitializedRequestSchema, {
    projectPath: projectPath.trim(),
  })
  const response = await centyClient.isInitialized(request)
  return response.initialized
}

export async function fetchSharedAssets(projectPath: string): Promise<Asset[]> {
  const request = create(ListSharedAssetsRequestSchema, {
    projectPath: projectPath.trim(),
  })
  const response = await centyClient.listSharedAssets(request)
  return response.assets
}

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
