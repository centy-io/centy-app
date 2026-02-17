import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { DeleteUserRequestSchema } from '@/gen/centy_pb'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { handleDaemonError, extractErrorMessage } from './userDetailErrors'

interface DeleteUserParams {
  projectPath: string
  userId: string
  router: AppRouterInstance
  usersListUrl: string
  setError: (e: string) => void
  setDeleting: (v: boolean) => void
  setShowDeleteConfirm: (v: boolean) => void
}

export async function deleteUser(params: DeleteUserParams) {
  const {
    projectPath,
    userId,
    router,
    usersListUrl,
    setError,
    setDeleting,
    setShowDeleteConfirm,
  } = params
  setDeleting(true)
  try {
    const request = create(DeleteUserRequestSchema, { projectPath, userId })
    const response = await centyClient.deleteUser(request)
    if (response.success) {
      router.push(usersListUrl)
    } else {
      handleDaemonError(response.error || 'Failed to delete user', setError)
      setShowDeleteConfirm(false)
    }
  } catch (err) {
    handleDaemonError(extractErrorMessage(err), setError)
    setShowDeleteConfirm(false)
  } finally {
    setDeleting(false)
  }
}
