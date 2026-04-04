import { useState, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import { useModalDismiss } from '../AddLinkModal/useModalDismiss'
import { updateLinkRequest } from './updateLinkRequest'
import { centyClient } from '@/lib/grpc/client'
import {
  GetAvailableLinkTypesRequestSchema,
  type Link as LinkType,
  type LinkTypeInfo,
} from '@/gen/centy_pb'
import { usePathContext } from '@/components/providers/PathContextProvider'

export function useEditLinkModal(
  link: LinkType,
  onClose: () => void,
  onLinkUpdated: () => void
) {
  const { projectPath } = usePathContext()
  const modalRef = useRef<HTMLDivElement>(null)
  const [linkTypes, setLinkTypes] = useState<LinkTypeInfo[]>([])
  const [selectedLinkType, setSelectedLinkType] = useState(link.linkType)
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      } catch (err) {
        console.error('Failed to load link types:', err)
      } finally {
        setLoadingTypes(false)
      }
    }
    void loadLinkTypes()
  }, [projectPath])

  async function handleSave() {
    if (!projectPath || !selectedLinkType) return
    setLoading(true)
    setError(null)
    try {
      const result = await updateLinkRequest(
        projectPath,
        link,
        selectedLinkType
      )
      if (result.success) {
        onLinkUpdated()
      } else {
        setError(result.error ?? 'Failed to update link')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update link')
    } finally {
      setLoading(false)
    }
  }

  return {
    modalRef,
    linkTypes,
    selectedLinkType,
    setSelectedLinkType,
    loadingTypes,
    loading,
    error,
    handleSave,
  }
}
