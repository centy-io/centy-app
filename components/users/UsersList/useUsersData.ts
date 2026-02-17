'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListUsersRequestSchema,
  IsInitializedRequestSchema,
  type User,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

export function useUsersData() {
  const { projectPath, isInitialized, setIsInitialized } = useProject()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkInitialized = useCallback(
    async (path: string) => {
      if (!path.trim()) {
        setIsInitialized(null)
        return
      }
      try {
        const request = create(IsInitializedRequestSchema, {
          projectPath: path.trim(),
        })
        const response = await centyClient.isInitialized(request)
        setIsInitialized(response.initialized)
      } catch {
        setIsInitialized(false)
      }
    },
    [setIsInitialized]
  )

  const fetchUsers = useCallback(async () => {
    if (!projectPath.trim() || isInitialized !== true) return
    setLoading(true)
    setError(null)
    try {
      const request = create(ListUsersRequestSchema, {
        projectPath: projectPath.trim(),
      })
      const response = await centyClient.listUsers(request)
      setUsers(response.users)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      if (isDaemonUnimplemented(message)) {
        setError(
          'User management is not yet available. Please update your daemon to the latest version.'
        )
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }, [projectPath, isInitialized])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkInitialized(projectPath)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [projectPath, checkInitialized])

  useEffect(() => {
    if (isInitialized === true) fetchUsers()
  }, [isInitialized, fetchUsers])

  return {
    projectPath,
    isInitialized,
    users,
    setUsers,
    loading,
    error,
    setError,
    fetchUsers,
  }
}
