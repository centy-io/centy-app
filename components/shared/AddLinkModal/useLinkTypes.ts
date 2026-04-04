import { useState, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import {
  GetAvailableLinkTypesRequestSchema,
  type LinkTypeInfo,
} from '@/gen/centy_pb'
import { centyClient } from '@/lib/grpc/client'

export function useLinkTypes(
  projectPath: string,
  isEditMode: boolean,
  initialLinkType: string
) {
  const [linkTypes, setLinkTypes] = useState<LinkTypeInfo[]>([])
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [selectedLinkType, setSelectedLinkType] = useState(initialLinkType)

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

  return { linkTypes, loadingTypes, selectedLinkType, setSelectedLinkType }
}
