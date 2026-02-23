'use client'

import { useMemo, useState, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { StateManager } from './StateManager'
import { useConfig } from '@/hooks/useConfig'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { centyClient } from '@/lib/grpc/client'
import { ListItemTypesRequestSchema } from '@/gen/centy_pb'

/**
 * React hook that provides a StateManager instance with current config.
 * Falls back to item type statuses from ListItemTypes when config.allowedStates is empty.
 */
export function useStateManager(): StateManager {
  const { config } = useConfig()
  const { projectPath, isInitialized } = usePathContext()
  const [itemTypeStatuses, setItemTypeStatuses] = useState<string[]>([])

  useEffect(() => {
    if (!isInitialized || !projectPath) return
    let cancelled = false

    async function fetchItemTypeStatuses() {
      try {
        const req = create(ListItemTypesRequestSchema, { projectPath })
        const res = await centyClient.listItemTypes(req)
        if (cancelled) return
        const issueType = res.itemTypes.find(t => t.plural === 'issues')
        const statuses =
          issueType !== undefined && issueType !== null
            ? issueType.statuses
            : []
        setItemTypeStatuses(statuses)
      } catch {
        // silently fall back to empty
      }
    }

    fetchItemTypeStatuses()
    return () => {
      cancelled = true
    }
  }, [projectPath, isInitialized])

  return useMemo(
    () => new StateManager(config, itemTypeStatuses),
    [config, itemTypeStatuses]
  )
}
