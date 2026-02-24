'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { DeleteOrganizationRequestSchema } from '@/gen/centy_pb'

export function useOrgDelete(orgSlug: string) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = useCallback(async () => {
    if (!orgSlug) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await centyClient.deleteOrganization(
        create(DeleteOrganizationRequestSchema, { slug: orgSlug })
      )
      if (res.success) router.push(route({ pathname: '/organizations' }))
      else setDeleteError(res.error || 'Failed to delete organization')
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setDeleting(false)
    }
  }, [orgSlug, router])

  return {
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteError,
    setDeleteError,
    handleDelete,
  }
}
