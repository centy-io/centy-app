'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListUsersRequestSchema,
  DeleteUserRequestSchema,
  type User,
} from '@/gen/centy_pb'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

function formatError(err: unknown): string {
  const message =
    err instanceof Error ? err.message : 'Failed to connect to daemon'
  if (isDaemonUnimplemented(message)) {
    return 'User management is not yet available. Please update your daemon to the latest version.'
  }
  return message
}

export function useUsersData() {
  const { projectPath, isInitialized } = usePathContext()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

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
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }, [projectPath, isInitialized])

  useEffect(() => {
    if (isInitialized === true) fetchUsers()
  }, [isInitialized, fetchUsers])

  const handleDelete = useCallback(
    async (userId: string) => {
      if (!projectPath) return
      setDeleting(true)
      setError(null)
      try {
        const request = create(DeleteUserRequestSchema, { projectPath, userId })
        const response = await centyClient.deleteUser(request)
        if (response.success) {
          setUsers(prev => prev.filter(u => u.id !== userId))
        } else {
          setError(response.error || 'Failed to delete user')
        }
      } catch (err) {
        setError(formatError(err))
      } finally {
        setDeleting(false)
      }
    },
    [projectPath]
  )

  return {
    projectPath,
    isInitialized,
    users,
    loading,
    error,
    deleting,
    fetchUsers,
    handleDelete,
  }
}
