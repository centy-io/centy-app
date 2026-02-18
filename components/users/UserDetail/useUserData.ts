'use client'

import { useState, useCallback, useEffect } from 'react'
import { type RouteLiteral } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { useUserMutations } from './useUserMutations'
import { centyClient } from '@/lib/grpc/client'
import { GetUserRequestSchema, type User } from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

function formatError(err: unknown): string {
  const msg = err instanceof Error ? err.message : 'Failed to connect to daemon'
  return isDaemonUnimplemented(msg)
    ? 'User management is not yet available. Please update your daemon to the latest version.'
    : msg
}

export function useUserData(userId: string, usersListUrl: RouteLiteral | '/') {
  const { projectPath } = useProject()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editGitUsernames, setEditGitUsernames] = useState<string[]>([])

  const fetchUser = useCallback(async () => {
    if (!projectPath || !userId) {
      setError('Missing project path or user ID')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const req = create(GetUserRequestSchema, { projectPath, userId })
      const res = await centyClient.getUser(req)
      if (res.user) {
        setUser(res.user)
        setEditName(res.user.name)
        setEditEmail(res.user.email || '')
        setEditGitUsernames([...res.user.gitUsernames])
      } else {
        setError(res.error || 'User not found')
      }
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }, [projectPath, userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const mutations = useUserMutations(
    projectPath,
    userId,
    usersListUrl,
    { editName, editEmail, editGitUsernames },
    setUser,
    setIsEditing,
    setError
  )

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
    ...mutations,
  }
}
