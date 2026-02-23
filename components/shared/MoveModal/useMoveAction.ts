import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { MoveItemRequestSchema } from '@/gen/centy_pb'

export function useMoveAction(
  entityType: 'issue' | 'doc',
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
    try {
      if (entityType === 'issue') {
        const request = create(MoveItemRequestSchema, {
          sourceProjectPath: currentProjectPath,
          itemType: 'issues',
          itemId: entityId,
          targetProjectPath: selectedProject,
        })
        const response = await centyClient.moveItem(request)
        if (response.success) {
          onMoved(selectedProject, response.item ? response.item.id : undefined)
        } else {
          setError(response.error || 'Failed to move issue')
        }
      } else {
        const request = create(MoveItemRequestSchema, {
          sourceProjectPath: currentProjectPath,
          itemType: 'docs',
          itemId: entityId,
          targetProjectPath: selectedProject,
          newId: newSlug || undefined,
        })
        const response = await centyClient.moveItem(request)
        if (response.success) {
          onMoved(selectedProject, response.item ? response.item.id : undefined)
        } else {
          setError(response.error || 'Failed to move document')
        }
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
