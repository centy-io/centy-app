import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { IsInitializedRequestSchema } from '@/gen/centy_pb'

export async function checkProjectInitialized(
  path: string
): Promise<boolean | null> {
  if (!path.trim()) return null
  try {
    const request = create(IsInitializedRequestSchema, {
      projectPath: path.trim(),
    })
    const response = await centyClient.isInitialized(request)
    return response.initialized
  } catch {
    return false
  }
}
