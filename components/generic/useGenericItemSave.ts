import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateItemRequestSchema, type GenericItem } from '@/gen/centy_pb'

interface UseGenericItemSaveParams {
  projectPath: string
  itemType: string
  item: GenericItem | null
  editTitle: string
  editBody: string
  editStatus: string
  editCustomFields: Record<string, string>
  setItem: (item: GenericItem) => void
  setIsEditing: (editing: boolean) => void
  setError: (error: string | null) => void
}

export function useGenericItemSave({
  projectPath,
  itemType,
  item,
  editTitle,
  editBody,
  editStatus,
  editCustomFields,
  setItem,
  setIsEditing,
  setError,
}: UseGenericItemSaveParams) {
  const [saving, setSaving] = useState(false)

  const handleSave = useCallback(async () => {
    if (!projectPath || !item) return
    setSaving(true)
    setError(null)
    try {
      const request = create(UpdateItemRequestSchema, {
        projectPath,
        itemType,
        itemId: item.id,
        title: editTitle,
        body: editBody,
        status: editStatus,
        customFields: editCustomFields,
      })
      const response = await centyClient.updateItem(request)
      if (response.success && response.item) {
        setItem(response.item)
        setIsEditing(false)
      } else {
        setError(response.error || 'Failed to save')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setSaving(false)
    }
  }, [
    projectPath,
    itemType,
    item,
    editTitle,
    editBody,
    editStatus,
    editCustomFields,
    setItem,
    setIsEditing,
    setError,
  ])

  return { saving, handleSave }
}
