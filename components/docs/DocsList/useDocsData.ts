import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListItemsRequestSchema,
  DeleteItemRequestSchema,
  type Doc,
} from '@/gen/centy_pb'
import { genericItemToDoc } from '@/lib/genericItemToDoc'

async function fetchDocsRequest(projectPath: string): Promise<Doc[]> {
  const request = create(ListItemsRequestSchema, {
    projectPath: projectPath.trim(),
    itemType: 'docs',
  })
  const response = await centyClient.listItems(request)
  return response.items.map(genericItemToDoc)
}

async function deleteDocRequest(
  projectPath: string,
  slug: string
): Promise<{ success: boolean; error?: string }> {
  const request = create(DeleteItemRequestSchema, {
    projectPath,
    itemType: 'docs',
    itemId: slug,
  })
  const response = await centyClient.deleteItem(request)
  return { success: response.success, error: response.error }
}

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
      setDocs(await fetchDocsRequest(projectPath))
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
        const result = await deleteDocRequest(projectPath, slug)
        if (result.success) {
          setDocs(prev => prev.filter(d => d.slug !== slug))
          setDeleteConfirm(null)
        } else {
          setError(result.error || 'Failed to delete document')
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
