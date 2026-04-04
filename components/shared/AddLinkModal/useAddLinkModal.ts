import { useState, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import type { AddLinkModalProps, EntityItem } from './AddLinkModal.types'
import { useEntitySearch } from './useEntitySearch'
import { useModalDismiss } from './useModalDismiss'
import { useCreateLink } from './useCreateLink'
import { useUpdateLink } from './useUpdateLink'
import {
  GetAvailableLinkTypesRequestSchema,
  type LinkTypeInfo,
} from '@/gen/centy_pb'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { centyClient } from '@/lib/grpc/client'

function getInverseLinkTypeName(_: LinkTypeInfo[], linkType: string): string {
  return linkType
}

function getEntityLabel(item: EntityItem): string {
  if (item.displayNumber) {
    return `#${item.displayNumber} - ${item.title}`
  }
  return `${item.id} - ${item.title}`
}

function buildInitialTarget(
  editingLink: AddLinkModalProps['editingLink'],
  editingLinkTitle: string | undefined
): EntityItem | null {
  if (!editingLink) return null
  return {
    id: editingLink.targetId,
    type: editingLink.targetItemType,
    title: editingLinkTitle ?? editingLink.targetId,
  }
}

export function useAddLinkModal({
  entityId,
  entityType,
  existingLinks,
  onClose,
  onLinkCreated,
  editingLink,
  editingLinkTitle,
  onLinkUpdated,
}: AddLinkModalProps) {
  const isEditMode = !!editingLink
  const { projectPath } = usePathContext()
  const modalRef = useRef<HTMLDivElement>(null)
  const [linkTypes, setLinkTypes] = useState<LinkTypeInfo[]>([])
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [selectedLinkType, setSelectedLinkType] = useState(
    editingLink ? editingLink.linkType : ''
  )
  const [selectedTarget, setSelectedTarget] = useState<EntityItem | null>(
    buildInitialTarget(editingLink, editingLinkTitle)
  )

  const search = useEntitySearch(
    projectPath,
    entityId,
    existingLinks,
    selectedLinkType
  )
  const {
    loading: createLoading,
    error: createError,
    handleCreateLink,
  } = useCreateLink(
    projectPath,
    entityId,
    entityType,
    selectedTarget,
    selectedLinkType,
    onLinkCreated
  )
  const {
    loading: updateLoading,
    error: updateError,
    handleUpdateLink,
  } = useUpdateLink(projectPath, editingLink, selectedLinkType, onLinkUpdated)

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
        if (!isEditMode && response.linkTypes.length > 0) {
          setSelectedLinkType(response.linkTypes[0].name)
        }
      } catch (err) {
        console.error('Failed to load link types:', err)
      } finally {
        setLoadingTypes(false)
      }
    }
    void loadLinkTypes()
  }, [projectPath, isEditMode])

  return {
    modalRef,
    linkTypes,
    selectedLinkType,
    setSelectedLinkType,
    selectedTarget,
    setSelectedTarget,
    loading: isEditMode ? updateLoading : createLoading,
    loadingTypes,
    error: isEditMode ? updateError : createError,
    isEditMode,
    originalLinkType: editingLink?.linkType,
    handleCreateLink: isEditMode ? handleUpdateLink : handleCreateLink,
    getInverseLinkType: (linkType: string) =>
      getInverseLinkTypeName(linkTypes, linkType),
    getEntityLabel,
    entityType,
    ...search,
  }
}
