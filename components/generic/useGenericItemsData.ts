import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListItemsRequestSchema,
  DeleteItemRequestSchema,
  type GenericItem,
} from '@/gen/centy_pb'

// eslint-disable-next-line max-lines-per-function
export function useGenericItemsData(
  projectPath: string,
  isInitialized: boolean | null,
  itemType: string
) {
  const [items, setItems] = useState<GenericItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchItems = useCallback(async () => {
    if (!projectPath.trim() || isInitialized !== true) return
    setLoading(true)
    setError(null)
    try {
      const request = create(ListItemsRequestSchema, {
        projectPath: projectPath.trim(),
        itemType,
      })
      const response = await centyClient.listItems(request)
      setItems(response.items)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, isInitialized, itemType])

  const handleDelete = useCallback(
    async (itemId: string) => {
      if (!projectPath) return
      setDeleting(true)
      setError(null)
      try {
        const request = create(DeleteItemRequestSchema, {
          projectPath,
          itemType,
          itemId,
        })
        const response = await centyClient.deleteItem(request)
        if (response.success) {
          setItems(prev => prev.filter(i => i.id !== itemId))
          setDeleteConfirm(null)
        } else {
          setError(response.error || 'Failed to delete item')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setDeleting(false)
      }
    },
    [projectPath, itemType]
  )

  useEffect(() => {
    if (isInitialized === true) {
      fetchItems()
    }
  }, [isInitialized, fetchItems])

  return {
    items,
    loading,
    error,
    deleteConfirm,
    setDeleteConfirm,
    deleting,
    fetchItems,
    handleDelete,
  }
}
