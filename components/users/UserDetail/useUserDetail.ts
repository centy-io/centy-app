'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetUserRequestSchema,
  UpdateUserRequestSchema,
  DeleteUserRequestSchema,
  type User,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import type { RouteLiteral } from 'nextjs-routes'

function handleDaemonError(message: string, setError: (e: string) => void) {
  if (isDaemonUnimplemented(message)) {
    setError(
      'User management is not yet available. Please update your daemon to the latest version.'
    )
  } else {
    setError(message)
  }
}

export function useUserDetail(
  userId: string,
  usersListUrl: RouteLiteral | '/'
) {
  const router = useRouter()
  const { projectPath } = useProject()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editGitUsernames, setEditGitUsernames] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const fetchUser = useCallback(async () => {
    if (!projectPath || !userId) {
      setError('Missing project path or user ID')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
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
      handleDaemonError(
        err instanceof Error ? err.message : 'Failed to connect to daemon',
        setError
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleSave = useCallback(async () => {
    if (!projectPath || !userId) return
    setSaving(true)
    setError(null)
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
      handleDaemonError(
        err instanceof Error ? err.message : 'Failed to connect to daemon',
        setError
      )
    } finally {
      setSaving(false)
    }
  }, [projectPath, userId, editName, editEmail, editGitUsernames])

  const handleDelete = useCallback(async () => {
    if (!projectPath || !userId) return
    setDeleting(true)
    setError(null)
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
      handleDaemonError(
        err instanceof Error ? err.message : 'Failed to connect to daemon',
        setError
      )
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }, [projectPath, userId, router, usersListUrl])

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (user) {
      setEditName(user.name)
      setEditEmail(user.email || '')
      setEditGitUsernames([...user.gitUsernames])
    }
  }

  useSaveShortcut({
    onSave: handleSave,
    enabled: isEditing && !saving && !!editName.trim(),
  })

  return {
    projectPath,
    user,
    loading,
    error,
    isEditing,
    setIsEditing,
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    editGitUsernames,
    setEditGitUsernames,
    saving,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleSave,
    handleDelete,
    handleCancelEdit,
  }
}
