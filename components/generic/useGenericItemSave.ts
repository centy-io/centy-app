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
  editProjects: string[]
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
  editProjects,
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
      // Normalize: a project-local item (meta.projects = []) is treated as
      // belonging to just the current project for comparison purposes.
      const metaProjects = item.metadata?.projects ?? []
      const normalizedOriginal =
        metaProjects.length > 0 ? metaProjects : [projectPath]
      const projectsChanged =
        editProjects.length !== normalizedOriginal.length ||
        editProjects.some(p => !normalizedOriginal.includes(p))
      const request = create(UpdateItemRequestSchema, {
        projectPath,
        itemType,
        itemId: item.id,
        title: editTitle,
        body: editBody,
        status: editStatus,
        customFields: editCustomFields,
        ...(projectsChanged ? { projects: editProjects } : {}),
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
    editProjects,
    setItem,
    setIsEditing,
    setError,
  ])

  return { saving, handleSave }
}
