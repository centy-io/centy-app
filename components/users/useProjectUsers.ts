'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListUsersRequestSchema, type User } from '@/gen/centy_pb'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

interface ProjectUsersState {
  users: User[]
  loading: boolean
  error: string | null
  setError: (error: string | null) => void
  fetchUsers: () => Promise<void>
}

export function useProjectUsers(projectPath: string): ProjectUsersState {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    if (!projectPath) return

    setLoading(true)
    setError(null)

    try {
      const request = create(ListUsersRequestSchema, {
        projectPath,
      })
      const response = await centyClient.listUsers(request)
      setUsers(response.users)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load users'
      if (isDaemonUnimplemented(message)) {
        setError('User management not available')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }, [projectPath])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  return { users, loading, error, setError, fetchUsers }
}
