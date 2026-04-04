import { useState, useRef } from 'react'
import type { AddLinkModalProps, EntityItem } from './AddLinkModal.types'
import { useEntitySearch } from './useEntitySearch'
import { useModalDismiss } from './useModalDismiss'
import { useCreateLink } from './useCreateLink'
import { useUpdateLink } from './useUpdateLink'
import { useLinkTypes } from './useLinkTypes'
import type { LinkTypeInfo } from '@/gen/centy_pb'
import { usePathContext } from '@/components/providers/PathContextProvider'

function getInverseLinkTypeName(_: LinkTypeInfo[], linkType: string): string {
  return linkType
}

function getEntityLabel(item: EntityItem): string {
  if (item.displayNumber) return `#${item.displayNumber} - ${item.title}`
  return `${item.id} - ${item.title}`
}

function buildInitialTarget(
  editingLink: AddLinkModalProps['editingLink'],
  title: string | undefined
): EntityItem | null {
  if (!editingLink) return null
  return {
    id: editingLink.targetId,
    type: editingLink.targetItemType,
    title: title ?? editingLink.targetId,
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
  const [selectedLinkType, setSelectedLinkType] = useState(
    editingLink?.linkType ?? ''
  )
  const [selectedTarget, setSelectedTarget] = useState<EntityItem | null>(
    buildInitialTarget(editingLink, editingLinkTitle)
  )

  const { linkTypes, loadingTypes } = useLinkTypes(
    isEditMode ? undefined : setSelectedLinkType
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
    getInverseLinkType: (lt: string) => getInverseLinkTypeName(linkTypes, lt),
    getEntityLabel,
    entityType,
    ...search,
  }
}
