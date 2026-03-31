import { useState } from 'react'
import type { RouteLiteral } from 'nextjs-routes'
import { useGenericItemFetch } from './useGenericItemFetch'
import { useGenericItemSave } from './useGenericItemSave'
import { useGenericItemDelete } from './useGenericItemDelete'
import { useItemTypeConfig } from './useItemTypeConfig'
import type { ItemTypeConfigProto } from '@/gen/centy_pb'
import { useAppLink } from '@/hooks/useAppLink'

interface UseGenericItemDetailStateResult {
  config: ItemTypeConfigProto | null
  isEditing: boolean
  setIsEditing: (v: boolean) => void
  showDeleteConfirm: boolean
  setShowDeleteConfirm: (v: boolean) => void
  listUrl: RouteLiteral
  fetch: ReturnType<typeof useGenericItemFetch>
  saving: boolean
  handleSave: () => Promise<void>
  deleting: boolean
  restoring: boolean
  handleDelete: () => Promise<void>
  handleSoftDelete: () => Promise<void>
  handleRestore: () => Promise<void>
}

export function useGenericItemDetailState(
  projectPath: string,
  itemType: string,
  itemId: string
): UseGenericItemDetailStateResult {
  const { createLink } = useAppLink()
  const { config } = useItemTypeConfig(projectPath, true, itemType)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const listUrl = createLink(`/${itemType}`)
  const fetch = useGenericItemFetch(projectPath, itemType, itemId)
  const { saving, handleSave } = useGenericItemSave({
    projectPath,
    itemType,
    item: fetch.item,
    editTitle: fetch.editTitle,
    editBody: fetch.editBody,
    editStatus: fetch.editStatus,
    editCustomFields: fetch.editCustomFields,
    setItem: fetch.setItem,
    setIsEditing,
    setError: fetch.setError,
  })
  const { deleting, restoring, handleDelete, handleSoftDelete, handleRestore } =
    useGenericItemDelete({
      projectPath,
      itemType,
      item: fetch.item,
      listUrl,
      setError: fetch.setError,
      setItem: fetch.setItem,
    })
  return {
    config,
    isEditing,
    setIsEditing,
    showDeleteConfirm,
    setShowDeleteConfirm,
    listUrl,
    fetch,
    saving,
    handleSave,
    deleting,
    restoring,
    handleDelete,
    handleSoftDelete,
    handleRestore,
  }
}
