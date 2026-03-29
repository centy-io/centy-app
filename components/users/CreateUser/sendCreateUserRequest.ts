import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { CreateUserRequestSchema, type User } from '@/gen/centy_pb'

interface SendCreateUserRequestResult {
  success: boolean
  user?: User
  error?: string
}

export async function sendCreateUserRequest(
  projectPath: string,
  name: string,
  userId: string,
  email: string,
  gitUsernames: string[]
): Promise<SendCreateUserRequestResult> {
  const req = create(CreateUserRequestSchema, {
    projectPath,
    id: userId.trim() || undefined,
    name: name.trim(),
    email: email.trim() || undefined,
    gitUsernames: gitUsernames.filter(u => u.trim() !== ''),
  })
  const res = await centyClient.createUser(req)
  return { success: res.success, user: res.user, error: res.error }
}
