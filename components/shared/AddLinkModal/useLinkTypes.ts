import { useState, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { usePathContext } from '@/components/providers/PathContextProvider'
import {
  GetAvailableLinkTypesRequestSchema,
  type LinkTypeInfo,
} from '@/gen/centy_pb'

export function useLinkTypes(
  onFirstLoaded: ((type: string) => void) | undefined
) {
  const { projectPath } = usePathContext()
  const [linkTypes, setLinkTypes] = useState<LinkTypeInfo[]>([])
  const [loadingTypes, setLoadingTypes] = useState(true)
  const callbackRef = useRef(onFirstLoaded)
  callbackRef.current = onFirstLoaded

  useEffect(() => {
    async function load() {
      if (!projectPath) return
      try {
        const request = create(GetAvailableLinkTypesRequestSchema, {
          projectPath,
        })
        const response = await centyClient.getAvailableLinkTypes(request)
        setLinkTypes(response.linkTypes)
        if (response.linkTypes.length > 0) {
          callbackRef.current?.(response.linkTypes[0].name)
        }
      } catch (err) {
        console.error('Failed to load link types:', err)
      } finally {
        setLoadingTypes(false)
      }
    }
    void load()
  }, [projectPath])

  return { linkTypes, loadingTypes }
}
