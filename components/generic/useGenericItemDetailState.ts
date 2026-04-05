import { useState, useCallback } from 'react'
import type { RouteLiteral } from 'nextjs-routes'
import { useRouter } from 'next/navigation'
import { useGenericItemFetch } from './useGenericItemFetch'
import { useGenericItemSave } from './useGenericItemSave'
import { useGenericItemDelete } from './useGenericItemDelete'
import { useItemTypeConfig } from './useItemTypeConfig'
import type { ItemTypeConfigProto } from '@/gen/centy_pb'
import { useAppLink } from '@/hooks/useAppLink'
import { useProjectPathToUrl } from '@/components/providers/useProjectPathToUrl'

interface UseGenericItemDetailStateResult {
  config: ItemTypeConfigProto | null
  isEditing: boolean
  setIsEditing: (v: boolean) => void
  showDeleteConfirm: boolean
  setShowDeleteConfirm: (v: boolean) => void
  showMoveModal: boolean
  setShowMoveModal: (v: boolean) => void
  handleMoved: (targetProjectPath: string) => Promise<void>
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
  const router = useRouter()
  const resolvePathToUrl = useProjectPathToUrl()
  const { createLink, createProjectLink } = useAppLink()
  const { config } = useItemTypeConfig(projectPath, true, itemType)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const listUrl = createLink(`/${itemType}`)

  const handleMoved = useCallback(
    async (targetProjectPath: string) => {
      const result = await resolvePathToUrl(targetProjectPath)
      if (result) {
        router.push(
          createProjectLink(result.orgSlug, result.projectName, itemType)
        )
      } else {
        router.push(listUrl)
      }
    },
    [resolvePathToUrl, createProjectLink, router, itemType, listUrl]
  )
  const fetch = useGenericItemFetch(projectPath, itemType, itemId)
  const { saving, handleSave } = useGenericItemSave({
    projectPath,
    itemType,
    item: fetch.item,
    editTitle: fetch.editTitle,
    editBody: fetch.editBody,
    editStatus: fetch.editStatus,
    editCustomFields: fetch.editCustomFields,
    editProjects: fetch.editProjects,
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
    showMoveModal,
    setShowMoveModal,
    handleMoved,
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
