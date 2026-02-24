'use client'

import { useCallback, useState } from 'react'
import { create } from '@bufbuild/protobuf'
import { formatUserError } from './formatUserError'
import { centyClient } from '@/lib/grpc/client'
import { UpdateUserRequestSchema, type User } from '@/gen/centy_pb'
import { OperationError } from '@/lib/errors'

export interface EditState {
  editName: string
  editEmail: string
  editGitUsernames: string[]
}

export function useSaveUser(
  projectPath: string,
  userId: string,
  editState: EditState,
  setUser: (u: User) => void,
  setIsEditing: (v: boolean) => void,
  setError: (e: string | null) => void
) {
  const [saving, setSaving] = useState(false)
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
      } else
        setError(
          formatUserError(new OperationError(res.error || 'Failed to update'))
        )
    } catch (err) {
      setError(formatUserError(err))
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
  return { saving, handleSave }
}
