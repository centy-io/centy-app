'use client'

import { useCallback, useState } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { DeleteOrganizationRequestSchema } from '@/gen/centy_pb'

export function useOrgDeleteAction(
  setOrganizations: (
    fn: (
      prev: import('@/gen/centy_pb').Organization[]
    ) => import('@/gen/centy_pb').Organization[]
  ) => void
) {
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = useCallback(
    async (slug: string) => {
      setDeleting(true)
      setDeleteError(null)
      try {
        const response = await centyClient.deleteOrganization(
          create(DeleteOrganizationRequestSchema, { slug })
        )
        if (response.success) {
          setOrganizations(prev => prev.filter(o => o.slug !== slug))
          setShowDeleteConfirm(null)
        } else setDeleteError(response.error || 'Failed to delete organization')
      } catch (err) {
        setDeleteError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setDeleting(false)
      }
    },
    [setOrganizations]
  )

  return {
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteError,
    setDeleteError,
    handleDelete,
  }
}
