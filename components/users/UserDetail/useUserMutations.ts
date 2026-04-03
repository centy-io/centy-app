'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { type RouteLiteral } from 'nextjs-routes'
import type { UserEditState } from './UserEditState'
import { performUpdateUser } from './performUpdateUser'
import { performDeleteUser } from './performDeleteUser'
import { formatUserError } from './formatUserError'
import { OperationError } from '@/lib/errors'
import type { User } from '@/gen/centy_pb'

export function useUserMutations(
  projectPath: string,
  userId: string,
  usersListUrl: RouteLiteral,
  editState: UserEditState,
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
      const res = await performUpdateUser(projectPath, userId, editState)
      if (res.success && res.user) {
        setUser(res.user)
        setIsEditing(false)
      } else {
        setError(
          formatUserError(new OperationError(res.error ?? 'Failed to update'))
        )
      }
    } catch (err) {
      setError(formatUserError(err))
    } finally {
      setSaving(false)
    }
  }, [projectPath, userId, editState, setUser, setIsEditing, setError])

  const handleDelete = useCallback(async () => {
    if (!projectPath || !userId) return
    setDeleting(true)
    setError(null)
    try {
      const res = await performDeleteUser(projectPath, userId)
      if (res.success) {
        router.push(usersListUrl)
      } else {
        setError(
          formatUserError(new OperationError(res.error ?? 'Failed to delete'))
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

  return {
    saving,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleSave,
    handleDelete,
  }
}
