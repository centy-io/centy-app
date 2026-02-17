import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { GetUserRequestSchema, type User } from '@/gen/centy_pb'
import { handleDaemonError, extractErrorMessage } from './userDetailErrors'

interface FetchUserCallbacks {
  setUser: (u: User) => void
  setEditName: (v: string) => void
  setEditEmail: (v: string) => void
  setEditGitUsernames: (v: string[]) => void
  setError: (e: string) => void
  setLoading: (v: boolean) => void
}

export async function fetchUserData(
  projectPath: string,
  userId: string,
  callbacks: FetchUserCallbacks
) {
  const {
    setUser,
    setEditName,
    setEditEmail,
    setEditGitUsernames,
    setError,
    setLoading,
  } = callbacks
  setLoading(true)
  try {
    const request = create(GetUserRequestSchema, { projectPath, userId })
    const response = await centyClient.getUser(request)
    if (response.user) {
      setUser(response.user)
      setEditName(response.user.name)
      setEditEmail(response.user.email || '')
      setEditGitUsernames([...response.user.gitUsernames])
    } else {
      setError(response.error || 'User not found')
    }
  } catch (err) {
    handleDaemonError(extractErrorMessage(err), setError)
  } finally {
    setLoading(false)
  }
}
