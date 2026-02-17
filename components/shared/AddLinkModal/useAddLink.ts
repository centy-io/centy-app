import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  CreateLinkRequestSchema,
  GetAvailableLinkTypesRequestSchema,
  type LinkTypeInfo,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { useModalDismiss } from '@/components/shared/useModalDismiss'
import { targetTypeToProto } from './AddLinkModal.types'
import type { EntityItem, AddLinkModalProps } from './AddLinkModal.types'

export function useAddLink({
  entityId,
  entityType,
  onClose,
  onLinkCreated,
}: Pick<
  AddLinkModalProps,
  'entityId' | 'entityType' | 'onClose' | 'onLinkCreated'
>) {
  const { projectPath } = useProject()
  const modalRef = useModalDismiss(onClose)

  const [linkTypes, setLinkTypes] = useState<LinkTypeInfo[]>([])
  const [selectedLinkType, setSelectedLinkType] = useState('')
  const [selectedTarget, setSelectedTarget] = useState<EntityItem | null>(null)
  const [targetTypeFilter, setTargetTypeFilter] = useState<'issue' | 'doc'>(
    'issue'
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadLinkTypes() {
      if (!projectPath) return
      try {
        const request = create(GetAvailableLinkTypesRequestSchema, {
          projectPath,
        })
        const response = await centyClient.getAvailableLinkTypes(request)
        setLinkTypes(response.linkTypes)
        if (response.linkTypes.length > 0) {
          setSelectedLinkType(response.linkTypes[0].name)
        }
      } catch (err) {
        console.error('Failed to load link types:', err)
      } finally {
        setLoadingTypes(false)
      }
    }
    loadLinkTypes()
  }, [projectPath])

  const handleCreateLink = useCallback(async () => {
    if (!projectPath || !selectedTarget || !selectedLinkType) return
    setLoading(true)
    setError(null)
    try {
      const request = create(CreateLinkRequestSchema, {
        projectPath,
        sourceId: entityId,
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
    modalRef,
    projectPath,
    linkTypes,
    selectedLinkType,
    setSelectedLinkType,
    selectedTarget,
    setSelectedTarget,
    targetTypeFilter,
    setTargetTypeFilter,
    searchQuery,
    setSearchQuery,
    loading,
    loadingTypes,
    error,
    handleCreateLink,
  }
}
