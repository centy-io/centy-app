import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import type { EntityItem } from './AddLinkModal.types'
import { centyClient } from '@/lib/grpc/client'
import { CreateLinkRequestSchema } from '@/gen/centy_pb'

export function useCreateLink(
  projectPath: string,
  entityId: string,
  entityType: string,
  selectedTarget: EntityItem | null,
  selectedLinkType: string,
  onLinkCreated: () => void
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateLink = useCallback(async () => {
    if (!projectPath || !selectedTarget || !selectedLinkType) return
    setLoading(true)
    setError(null)
    try {
      const request = create(CreateLinkRequestSchema, {
        projectPath,
        sourceId: entityId,
        sourceItemType: entityType,
        targetId: selectedTarget.id,
        targetItemType: selectedTarget.type,
        linkType: selectedLinkType,
      })
      const response = await centyClient.createLink(request)
      if (response.success) {
        onLinkCreated()
      } else {
        setError(response.error || 'Failed to create link')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link')
    } finally {
      setLoading(false)
    }
  }, [
    projectPath,
    entityId,
    entityType,
    selectedTarget,
    selectedLinkType,
    onLinkCreated,
  ])

  return {
    loading,
    error,
    handleCreateLink,
  }
}
