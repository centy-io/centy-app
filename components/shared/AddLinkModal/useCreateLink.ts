import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import type { EntityItem } from './AddLinkModal.types'
import { centyClient } from '@/lib/grpc/client'
import { CreateLinkRequestSchema, LinkTargetType } from '@/gen/centy_pb'

const targetTypeToProto: Record<string, LinkTargetType> = {
  issue: LinkTargetType.ISSUE,
  doc: LinkTargetType.DOC,
}

export function useCreateLink(
  projectPath: string,
  entityId: string,
  entityType: 'issue' | 'doc',
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
        // eslint-disable-next-line security/detect-object-injection
        sourceType: targetTypeToProto[entityType],
        targetId: selectedTarget.id,
        targetType: targetTypeToProto[selectedTarget.type],
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
