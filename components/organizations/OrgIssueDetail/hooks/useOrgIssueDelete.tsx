'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { DeleteItemRequestSchema } from '@/gen/centy_pb'

function formatErr(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to connect to daemon'
}

export function useOrgIssueDelete(
  orgSlug: string,
  issueId: string,
  orgProjectPath: string | null
) {
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = useCallback(async () => {
    if (!orgProjectPath || !issueId) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await centyClient.deleteItem(
        create(DeleteItemRequestSchema, {
          projectPath: orgProjectPath,
          itemType: 'issues',
          itemId: issueId,
        })
      )
      if (res.success)
        router.push(
          route({
            pathname: '/organizations/[orgSlug]/issues',
            query: { orgSlug },
          })
        )
      else setDeleteError(res.error || 'Failed to delete issue')
    } catch (err) {
      setDeleteError(formatErr(err))
    } finally {
      setDeleting(false)
    }
  }, [orgProjectPath, issueId, orgSlug, router])

  return {
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleting,
    deleteError,
    setDeleteError,
    handleDelete,
  }
}
