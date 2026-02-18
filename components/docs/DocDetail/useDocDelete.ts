import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { RouteLiteral } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { DeleteDocRequestSchema } from '@/gen/centy_pb'

interface UseDocDeleteParams {
  projectPath: string
  slug: string
  setError: (error: string | null) => void
  docsListUrl: RouteLiteral
}

export function useDocDelete({
  projectPath,
  slug,
  setError,
  docsListUrl,
}: UseDocDeleteParams) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = useCallback(async () => {
    if (!projectPath || !slug) return

    setDeleting(true)
    setError(null)

    try {
      const request = create(DeleteDocRequestSchema, {
        projectPath,
        slug,
      })
      const response = await centyClient.deleteDoc(request)

      if (response.success) {
        router.push(docsListUrl)
      } else {
        setError(response.error || 'Failed to delete document')
        setShowDeleteConfirm(false)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }, [projectPath, slug, router, docsListUrl, setError])

  return {
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleDelete,
  }
}
