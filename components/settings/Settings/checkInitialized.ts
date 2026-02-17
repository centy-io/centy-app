import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { IsInitializedRequestSchema } from '@/gen/centy_pb'

export async function checkProjectInitialized(
  path: string,
  setIsInitialized: (val: boolean | null) => void
): Promise<void> {
  if (!path.trim()) {
    setIsInitialized(null)
    return
  }
  try {
    const request = create(IsInitializedRequestSchema, {
      projectPath: path.trim(),
    })
    const response = await centyClient.isInitialized(request)
    setIsInitialized(response.initialized)
  } catch {
    setIsInitialized(false)
  }
}
