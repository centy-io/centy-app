import { useState, useCallback, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import type { EntityItem } from './AddLinkModal.types'
import { fetchEntities } from './fetchEntities'
import type { Link as LinkType } from '@/gen/centy_pb'

export function useEntitySearch(
  projectPath: string,
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string
) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery] = useDebounce(searchQuery, 400)
  const [searchResults, setSearchResults] = useState<EntityItem[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)

  const searchEntities = useCallback(async () => {
    if (!projectPath) return
    setLoadingSearch(true)
    try {
      const results = await fetchEntities(
        projectPath,
        entityId,
        existingLinks,
        selectedLinkType,
        debouncedSearchQuery
      )
      setSearchResults(results)
    } catch (err) {
      console.error('Failed to search entities:', err)
    } finally {
      setLoadingSearch(false)
    }
  }, [
    projectPath,
    debouncedSearchQuery,
    entityId,
    existingLinks,
    selectedLinkType,
  ])

  useEffect(() => {
    void searchEntities()
  }, [searchEntities])

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    loadingSearch,
  }
}
