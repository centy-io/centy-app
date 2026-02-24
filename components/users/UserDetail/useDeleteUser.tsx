'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { type RouteLiteral } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { formatUserError } from './formatUserError'
import { centyClient } from '@/lib/grpc/client'
import { DeleteUserRequestSchema } from '@/gen/centy_pb'
import { OperationError } from '@/lib/errors'

export function useDeleteUser(
  projectPath: string,
  userId: string,
  usersListUrl: RouteLiteral,
  setError: (e: string | null) => void
) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const handleDelete = useCallback(async () => {
    if (!projectPath || !userId) return
    setDeleting(true)
    setError(null)
    try {
      const res = await centyClient.deleteUser(
        create(DeleteUserRequestSchema, { projectPath, userId })
      )
      if (res.success) router.push(usersListUrl)
      else {
        setError(
          formatUserError(new OperationError(res.error || 'Failed to delete'))
        )
        setShowDeleteConfirm(false)
      }
    } catch (err) {
      setError(formatUserError(err))
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }, [projectPath, userId, router, usersListUrl, setError])
  return { deleting, showDeleteConfirm, setShowDeleteConfirm, handleDelete }
}
