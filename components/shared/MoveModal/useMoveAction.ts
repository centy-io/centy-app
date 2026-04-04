import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { MoveItemRequestSchema } from '@/gen/centy_pb'

function resolveItemType(entityType: string): string {
  if (entityType === 'issue') return 'issues'
  if (entityType === 'doc') return 'docs'
  return entityType
}

export function useMoveAction(
  entityType: string,
  entityId: string,
  currentProjectPath: string,
  selectedProject: string,
  newSlug: string,
  onMoved: (targetProjectPath: string, newEntityId?: string) => void
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMove = useCallback(async () => {
    if (!selectedProject) return
    setLoading(true)
    setError(null)
    const isDoc = entityType === 'doc' || entityType === 'docs'
    try {
      const request = create(MoveItemRequestSchema, {
        sourceProjectPath: currentProjectPath,
        itemType: resolveItemType(entityType),
        itemId: entityId,
        targetProjectPath: selectedProject,
        ...(isDoc && newSlug ? { newId: newSlug } : {}),
      })
      const response = await centyClient.moveItem(request)
      if (response.success) {
        onMoved(selectedProject, response.item ? response.item.id : undefined)
      } else {
        setError(response.error || 'Failed to move item')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move')
    } finally {
      setLoading(false)
    }
  }, [
    entityType,
    entityId,
    currentProjectPath,
    selectedProject,
    newSlug,
    onMoved,
  ])

  return { loading, error, handleMove }
}
