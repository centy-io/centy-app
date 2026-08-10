import { useCallback } from 'react'
import { fetchEntities } from '@/components/shared/AddLinkModal/fetchEntities'
import type { WikiLinkItem } from '@/components/shared/TextEditor/extensions/WikiLink/WikiLinkItem'

export function useWikiLinkFetch(projectPath: string, entityId: string) {
  const fetchItems = useCallback(
    async (query: string): Promise<WikiLinkItem[]> => {
      if (!projectPath) return []
      try {
        const entities = await fetchEntities(
          projectPath,
          entityId,
          [],
          '',
          query
        )
        return entities.map(e => ({
          id: e.id,
          label: e.title,
          itemType: e.type,
          displayNumber: e.displayNumber,
        }))
      } catch {
        return []
      }
    },
    [projectPath, entityId]
  )

  return { fetchItems }
}
