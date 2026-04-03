import { useState, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListItemTypesRequestSchema,
  type ItemTypeConfigProto,
} from '@/gen/centy_pb'

export function useItemTypeConfig(
  projectPath: string,
  isInitialized: boolean | null,
  itemType: string
) {
  const [config, setConfig] = useState<ItemTypeConfigProto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectPath.trim() || isInitialized !== true || !itemType) return

    setLoading(true)
    setError(null)

    async function fetchConfig() {
      try {
        const request = create(ListItemTypesRequestSchema, {
          projectPath: projectPath.trim(),
        })
        const response = await centyClient.listItemTypes(request)
        const found = response.itemTypes.find(t => t.plural === itemType)
        if (found) {
          setConfig(found)
        } else {
          setError(`Unknown item type: ${itemType}`)
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setLoading(false)
      }
    }

    void fetchConfig()
  }, [projectPath, isInitialized, itemType])

  return { config, loading, error }
}
