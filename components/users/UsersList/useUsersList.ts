'use client'

import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { DeleteUserRequestSchema } from '@/gen/centy_pb'
import { useUsersData } from './useUsersData'

export function useUsersList() {
  const data = useUsersData()
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const [showSyncModal, setShowSyncModal] = useState(false)

  const handleDelete = useCallback(
    async (userId: string) => {
      if (!data.projectPath) return
      setDeleting(true)
      data.setError(null)
      try {
        const request = create(DeleteUserRequestSchema, {
          projectPath: data.projectPath,
          userId,
        })
        const response = await centyClient.deleteUser(request)
        if (response.success) {
          data.setUsers(prev => prev.filter(u => u.id !== userId))
          setShowDeleteConfirm(null)
        } else {
          data.setError(response.error || 'Failed to delete user')
        }
      } catch (err) {
        data.setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setDeleting(false)
      }
    },
    [data]
  )

  return {
    ...data,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showSyncModal,
    setShowSyncModal,
    handleDelete,
  }
}
