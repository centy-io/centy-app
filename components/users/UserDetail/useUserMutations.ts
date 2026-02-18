'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { type RouteLiteral } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  UpdateUserRequestSchema,
  DeleteUserRequestSchema,
  type User,
} from '@/gen/centy_pb'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

function formatError(err: unknown): string {
  const msg = err instanceof Error ? err.message : 'Failed to connect to daemon'
  return isDaemonUnimplemented(msg)
    ? 'User management is not yet available. Please update your daemon to the latest version.'
    : msg
}

// eslint-disable-next-line max-lines-per-function
export function useUserMutations(
  projectPath: string,
  userId: string,
  usersListUrl: RouteLiteral | '/',
  editState: {
    editName: string
    editEmail: string
    editGitUsernames: string[]
  },
  setUser: (user: User) => void,
  setIsEditing: (v: boolean) => void,
  setError: (e: string | null) => void
) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = useCallback(async () => {
    if (!projectPath || !userId) return
    setSaving(true)
    setError(null)
    try {
      const req = create(UpdateUserRequestSchema, {
        projectPath,
        userId,
        name: editState.editName,
        email: editState.editEmail,
        gitUsernames: editState.editGitUsernames.filter(u => u.trim() !== ''),
      })
      const res = await centyClient.updateUser(req)
      if (res.success && res.user) {
        setUser(res.user)
        setIsEditing(false)
      } else {
        setError(formatError(new Error(res.error || 'Failed to update')))
      }
    } catch (err) {
      setError(formatError(err))
    } finally {
      setSaving(false)
    }
  }, [
    projectPath,
    userId,
    editState.editName,
    editState.editEmail,
    editState.editGitUsernames,
    setUser,
    setIsEditing,
    setError,
  ])

  const handleDelete = useCallback(async () => {
    if (!projectPath || !userId) return
    setDeleting(true)
    setError(null)
    try {
      const req = create(DeleteUserRequestSchema, { projectPath, userId })
      const res = await centyClient.deleteUser(req)
      if (res.success) {
        router.push(usersListUrl)
      } else {
        setError(formatError(new Error(res.error || 'Failed to delete')))
        setShowDeleteConfirm(false)
      }
    } catch (err) {
      setError(formatError(err))
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }, [projectPath, userId, router, usersListUrl, setError])

  return {
    saving,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleSave,
    handleDelete,
  }
}
