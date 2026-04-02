import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { IsInitializedRequestSchema } from '@/gen/centy_pb'

export async function checkProjectInitialized(
  projectPath: string
): Promise<boolean> {
  const request = create(IsInitializedRequestSchema, {
    projectPath: projectPath.trim(),
  })
  const response = await centyClient.isInitialized(request)
  return response.initialized
}
