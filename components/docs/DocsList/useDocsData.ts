import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListDocsRequestSchema,
  DeleteDocRequestSchema,
  type Doc,
} from '@/gen/centy_pb'

export function useDocsData(
  projectPath: string,
  isInitialized: boolean | null
) {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchDocs = useCallback(async () => {
    if (!projectPath.trim() || isInitialized !== true) return

    setLoading(true)
    setError(null)

    try {
      const request = create(ListDocsRequestSchema, {
        projectPath: projectPath.trim(),
      })
      const response = await centyClient.listDocs(request)
      setDocs(response.docs)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, isInitialized])

  const handleDelete = useCallback(
    async (slug: string) => {
      if (!projectPath) return

      setDeleting(true)
      setError(null)

      try {
        const request = create(DeleteDocRequestSchema, {
          projectPath,
          slug,
        })
        const response = await centyClient.deleteDoc(request)

        if (response.success) {
          setDocs(prev => prev.filter(d => d.slug !== slug))
          setDeleteConfirm(null)
        } else {
          setError(response.error || 'Failed to delete document')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setDeleting(false)
      }
    },
    [projectPath]
  )

  useEffect(() => {
    if (isInitialized === true) {
      fetchDocs()
    }
  }, [isInitialized, fetchDocs])

  return {
    docs,
    loading,
    error,
    deleteConfirm,
    setDeleteConfirm,
    deleting,
    fetchDocs,
    handleDelete,
  }
}
