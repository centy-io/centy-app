import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { callItemApi } from './callItemApi'
import { centyClient } from '@/lib/grpc/client'
import {
  ListItemsRequestSchema,
  DeleteItemRequestSchema,
  SoftDeleteItemRequestSchema,
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
      const response = await centyClient.listItems(
        create(ListItemsRequestSchema, {
          projectPath: projectPath.trim(),
          itemType,
        })
      )
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
      const res = await callItemApi(
        () =>
          centyClient.deleteItem(
            create(DeleteItemRequestSchema, { projectPath, itemType, itemId })
          ),
        setDeleting,
        setError
      )
      if (res && res.success) {
        setItems(prev => prev.filter(i => i.id !== itemId))
        setDeleteConfirm(null)
      } else if (res) setError(res.error || 'Failed to delete item')
    },
    [projectPath, itemType]
  )

  const handleSoftDelete = useCallback(
    async (itemId: string) => {
      if (!projectPath) return
      const res = await callItemApi(
        () =>
          centyClient.softDeleteItem(
            create(SoftDeleteItemRequestSchema, {
              projectPath,
              itemType,
              itemId,
            })
          ),
        setDeleting,
        setError
      )
      if (res && res.success) {
        setItems(prev => prev.filter(i => i.id !== itemId))
        setDeleteConfirm(null)
      } else if (res) setError(res.error || 'Failed to archive item')
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
    handleSoftDelete,
  }
}
