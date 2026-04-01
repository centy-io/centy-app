import { create } from '@bufbuild/protobuf'
import type { UserEditState } from './UserEditState'
import { centyClient } from '@/lib/grpc/client'
import { UpdateUserRequestSchema, type User } from '@/gen/centy_pb'

interface UpdateUserResult {
  success: boolean
  user?: User
  error?: string
}

export async function performUpdateUser(
  projectPath: string,
  userId: string,
  editState: UserEditState
): Promise<UpdateUserResult> {
  const req = create(UpdateUserRequestSchema, {
    projectPath,
    userId,
    name: editState.editName,
    email: editState.editEmail,
    gitUsernames: editState.editGitUsernames.filter(u => u.trim() !== ''),
  })
  const res = await centyClient.updateUser(req)
  return { success: res.success, user: res.user, error: res.error }
}
