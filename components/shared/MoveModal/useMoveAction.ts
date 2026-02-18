import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { MoveIssueRequestSchema, MoveDocRequestSchema } from '@/gen/centy_pb'

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
        const request = create(MoveIssueRequestSchema, {
          sourceProjectPath: currentProjectPath,
          issueId: entityId,
          targetProjectPath: selectedProject,
        })
        const response = await centyClient.moveIssue(request)
        if (response.success) {
          onMoved(
            selectedProject,
            response.issue ? response.issue.id : undefined
          )
        } else {
          setError(response.error || 'Failed to move issue')
        }
      } else {
        const request = create(MoveDocRequestSchema, {
          sourceProjectPath: currentProjectPath,
          slug: entityId,
          targetProjectPath: selectedProject,
          newSlug: newSlug || undefined,
        })
        const response = await centyClient.moveDoc(request)
        if (response.success) {
          onMoved(selectedProject, response.doc ? response.doc.slug : undefined)
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
