import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateUserRequestSchema, type User } from '@/gen/centy_pb'
import { handleDaemonError, extractErrorMessage } from './userDetailErrors'

interface SaveUserParams {
  projectPath: string
  userId: string
  editName: string
  editEmail: string
  editGitUsernames: string[]
  setUser: (u: User) => void
  setIsEditing: (v: boolean) => void
  setError: (e: string) => void
  setSaving: (v: boolean) => void
}

export async function saveUser(params: SaveUserParams) {
  const {
    projectPath,
    userId,
    editName,
    editEmail,
    editGitUsernames,
    setUser,
    setIsEditing,
    setError,
    setSaving,
  } = params
  setSaving(true)
  try {
    const request = create(UpdateUserRequestSchema, {
      projectPath,
      userId,
      name: editName,
      email: editEmail,
      gitUsernames: editGitUsernames.filter(u => u.trim() !== ''),
    })
    const response = await centyClient.updateUser(request)
    if (response.success && response.user) {
      setUser(response.user)
      setIsEditing(false)
    } else {
      handleDaemonError(response.error || 'Failed to update user', setError)
    }
  } catch (err) {
    handleDaemonError(extractErrorMessage(err), setError)
  } finally {
    setSaving(false)
  }
}
