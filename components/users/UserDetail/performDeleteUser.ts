import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { DeleteUserRequestSchema } from '@/gen/centy_pb'

interface DeleteUserResult {
  success: boolean
  error?: string
}

export async function performDeleteUser(
  projectPath: string,
  userId: string
): Promise<DeleteUserResult> {
  const req = create(DeleteUserRequestSchema, { projectPath, userId })
  const res = await centyClient.deleteUser(req)
  return { success: res.success, error: res.error }
}
