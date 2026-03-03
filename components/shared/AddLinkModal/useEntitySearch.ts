import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import type { EntityItem } from './AddLinkModal.types'
import { filterAndMapIssues, filterAndMapDocs } from './entityFilters'
import { centyClient } from '@/lib/grpc/client'
import { ListItemsRequestSchema, type Link as LinkType } from '@/gen/centy_pb'
import { genericItemToIssue } from '@/lib/genericItemToIssue'
import { genericItemToDoc } from '@/lib/genericItemToDoc'

// eslint-disable-next-line max-lines-per-function
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<EntityItem[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const searchEntities = useCallback(async () => {
    if (!projectPath) return
    setLoadingSearch(true)
    try {
      let results: EntityItem[] = []
      if (targetTypeFilter === 'issue') {
        const request = create(ListItemsRequestSchema, {
          projectPath,
          itemType: 'issues',
        })
        const response = await centyClient.listItems(request)
        results = filterAndMapIssues(
          response.items.map(genericItemToIssue),
          entityId,
          existingLinks,
          selectedLinkType,
          debouncedSearchQuery
        )
      } else if (targetTypeFilter === 'doc') {
        const request = create(ListItemsRequestSchema, {
          projectPath,
          itemType: 'docs',
        })
        const response = await centyClient.listItems(request)
        results = filterAndMapDocs(
          response.items.map(genericItemToDoc),
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
    searchEntities()
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
