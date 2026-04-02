import { useState, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import type { AddLinkModalProps, EntityItem } from './AddLinkModal.types'
import { useEntitySearch } from './useEntitySearch'
import { useModalDismiss } from './useModalDismiss'
import { useCreateLink } from './useCreateLink'
import { usePathContext } from '@/components/providers/PathContextProvider'
import {
  GetAvailableLinkTypesRequestSchema,
  type LinkTypeInfo,
} from '@/gen/centy_pb'
import { centyClient } from '@/lib/grpc/client'

function getInverseLinkTypeName(
  linkTypes: LinkTypeInfo[],
  linkType: string
): string {
  const type = linkTypes.find(t => t.name === linkType)
  return (type ? type.inverse : '') || linkType
}

function getEntityLabel(item: EntityItem): string {
  if (item.displayNumber) {
    return `#${item.displayNumber} - ${item.title}`
  }
  return `${item.id} - ${item.title}`
}

export function useAddLinkModal({
  entityId,
  entityType,
  existingLinks,
  onClose,
  onLinkCreated,
}: AddLinkModalProps) {
  const { projectPath } = usePathContext()
  const modalRef = useRef<HTMLDivElement>(null)

  const [linkTypes, setLinkTypes] = useState<LinkTypeInfo[]>([])
  const [selectedLinkType, setSelectedLinkType] = useState('')
  const [selectedTarget, setSelectedTarget] = useState<EntityItem | null>(null)
  const [loadingTypes, setLoadingTypes] = useState(true)

  const search = useEntitySearch(
    projectPath,
    entityId,
    existingLinks,
    selectedLinkType
  )

  const { loading, error, handleCreateLink } = useCreateLink(
    projectPath,
    entityId,
    entityType,
    selectedTarget,
    selectedLinkType,
    onLinkCreated
  )

  useModalDismiss(modalRef, onClose)

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

  return {
    modalRef,
    linkTypes,
    selectedLinkType,
    setSelectedLinkType,
    selectedTarget,
    setSelectedTarget,
    loading,
    loadingTypes,
    error,
    handleCreateLink,
    getInverseLinkType: (linkType: string) =>
      getInverseLinkTypeName(linkTypes, linkType),
    getEntityLabel,
    entityType,
    ...search,
  }
}
