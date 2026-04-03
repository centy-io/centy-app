import { useState, useCallback, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import type { EntityItem } from './AddLinkModal.types'
import { fetchIssueEntities } from './fetchIssueEntities'
import { fetchDocEntities } from './fetchDocEntities'
import type { Link as LinkType } from '@/gen/centy_pb'

export function useEntitySearch(
  projectPath: string,
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string
) {
  const [targetTypeFilter, setTargetTypeFilter] = useState<'issue' | 'doc'>(
    'issue'
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery] = useDebounce(searchQuery, 400)
  const [searchResults, setSearchResults] = useState<EntityItem[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)

  const searchEntities = useCallback(async () => {
    if (!projectPath) return
    setLoadingSearch(true)
    try {
      let results: EntityItem[] = []
      if (targetTypeFilter === 'issue') {
        results = await fetchIssueEntities(
          projectPath,
          entityId,
          existingLinks,
          selectedLinkType,
          debouncedSearchQuery
        )
      } else if (targetTypeFilter === 'doc') {
        results = await fetchDocEntities(
          projectPath,
          entityId,
          existingLinks,
          selectedLinkType,
          debouncedSearchQuery
        )
      }
      setSearchResults(results)
    } catch (err) {
      console.error('Failed to search entities:', err)
    } finally {
      setLoadingSearch(false)
    }
  }, [
    projectPath,
    targetTypeFilter,
    debouncedSearchQuery,
    entityId,
    existingLinks,
    selectedLinkType,
  ])

  useEffect(() => {
    void searchEntities()
  }, [searchEntities])

  return {
    targetTypeFilter,
    setTargetTypeFilter,
    searchQuery,
    setSearchQuery,
    searchResults,
    loadingSearch,
  }
}
