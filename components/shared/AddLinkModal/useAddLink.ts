import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { CreateLinkRequestSchema, type LinkTypeInfo } from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { useModalDismiss } from '@/components/shared/useModalDismiss'
import { targetTypeToProto } from './AddLinkModal.types'
import type { EntityItem, AddLinkModalProps } from './AddLinkModal.types'
import { loadLinkTypes } from './loadLinkTypes'

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
    if (!projectPath) return
    loadLinkTypes(projectPath)
      .then(result => {
        setLinkTypes(result.linkTypes)
        if (result.defaultLinkType) {
          setSelectedLinkType(result.defaultLinkType)
        }
      })
      .catch(err => console.error('Failed to load link types:', err))
      .finally(() => setLoadingTypes(false))
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
