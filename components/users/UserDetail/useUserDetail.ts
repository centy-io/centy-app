'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProject } from '@/components/providers/ProjectProvider'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import type { RouteLiteral } from 'nextjs-routes'
import { fetchUserData } from './fetchUserApi'
import { saveUser } from './saveUserApi'
import { deleteUser } from './deleteUserApi'
import { useUserEditState } from './useUserEditState'
import type { User } from '@/gen/centy_pb'

export function useUserDetail(
  userId: string,
  usersListUrl: RouteLiteral | '/'
) {
  const router = useRouter()
  const { projectPath } = useProject()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const edit = useUserEditState()

  const fetchUser = useCallback(async () => {
    if (!projectPath || !userId) {
      setError('Missing project path or user ID')
      setLoading(false)
      return
    }
    setError(null)
    await fetchUserData(projectPath, userId, {
      setUser,
      setEditName: edit.setEditName,
      setEditEmail: edit.setEditEmail,
      setEditGitUsernames: edit.setEditGitUsernames,
      setError,
      setLoading,
    })
  }, [projectPath, userId, edit])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleSave = useCallback(async () => {
    if (!projectPath || !userId) return
    setError(null)
    await saveUser({
      projectPath,
      userId,
      editName: edit.editName,
      editEmail: edit.editEmail,
      editGitUsernames: edit.editGitUsernames,
      setUser,
      setIsEditing: edit.setIsEditing,
      setError,
      setSaving: edit.setSaving,
    })
  }, [projectPath, userId, edit])

  const handleDelete = useCallback(async () => {
    if (!projectPath || !userId) return
    setError(null)
    await deleteUser({
      projectPath,
      userId,
      router,
      usersListUrl,
      setError,
      setDeleting,
      setShowDeleteConfirm,
    })
  }, [projectPath, userId, router, usersListUrl])

  useSaveShortcut({
    onSave: handleSave,
    enabled: edit.isEditing && !edit.saving && !!edit.editName.trim(),
  })

  return {
    projectPath,
    user,
    loading,
    error,
    ...edit,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleSave,
    handleDelete,
    handleCancelEdit: () => edit.handleCancelEdit(user),
  }
}
