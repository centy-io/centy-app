import { useState, useCallback, useEffect } from 'react'
import { deleteListItem } from './deleteListItem'
import { fetchItemList } from './fetchItemList'
import { softDeleteListItem } from './softDeleteListItem'
import type { GenericItem } from '@/gen/centy_pb'

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
    const result = await fetchItemList(projectPath, itemType)
    setItems(result.items)
    if (result.error) setError(result.error)
    setLoading(false)
  }, [projectPath, isInitialized, itemType])

  const handleDelete = useCallback(
    async (itemId: string) => {
      if (!projectPath) return
      const ok = await deleteListItem(
        projectPath,
        itemType,
        itemId,
        setDeleting,
        setError
      )
      if (!ok) return
      setItems(prev => prev.filter(i => i.id !== itemId))
      setDeleteConfirm(null)
    },
    [projectPath, itemType]
  )

  const handleSoftDelete = useCallback(
    async (itemId: string) => {
      if (!projectPath) return
      const ok = await softDeleteListItem(
        projectPath,
        itemType,
        itemId,
        setDeleting,
        setError
      )
      if (!ok) return
      setItems(prev => prev.filter(i => i.id !== itemId))
      setDeleteConfirm(null)
    },
    [projectPath, itemType]
  )

  useEffect(() => {
    if (isInitialized !== true) return
    void fetchItems()
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
