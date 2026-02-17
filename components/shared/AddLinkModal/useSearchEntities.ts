import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListIssuesRequestSchema,
  ListDocsRequestSchema,
  type Issue,
  type Doc,
  type Link as LinkType,
} from '@/gen/centy_pb'
import type { EntityItem } from './AddLinkModal.types'

export function useSearchEntities(
  projectPath: string | undefined,
  targetTypeFilter: 'issue' | 'doc',
  searchQuery: string,
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string
) {
  const [searchResults, setSearchResults] = useState<EntityItem[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)

  const searchEntities = useCallback(async () => {
    if (!projectPath) return
    setLoadingSearch(true)
    try {
      const results: EntityItem[] = []
      if (targetTypeFilter === 'issue') {
        const request = create(ListIssuesRequestSchema, { projectPath })
        const response = await centyClient.listIssues(request)
        results.push(
          ...response.issues
            .filter((i: Issue) => i.id !== entityId)
            .filter(
              (i: Issue) =>
                !existingLinks.some(
                  l => l.targetId === i.id && l.linkType === selectedLinkType
                )
            )
            .filter(
              (i: Issue) =>
                !searchQuery ||
                i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(i.displayNumber).includes(searchQuery)
            )
            .map((i: Issue) => ({
              id: i.id,
              displayNumber: i.displayNumber,
              title: i.title,
              type: 'issue' as const,
            }))
        )
      } else if (targetTypeFilter === 'doc') {
        const request = create(ListDocsRequestSchema, { projectPath })
        const response = await centyClient.listDocs(request)
        results.push(
          ...response.docs
            .filter((d: Doc) => d.slug !== entityId)
            .filter(
              (d: Doc) =>
                !existingLinks.some(
                  l => l.targetId === d.slug && l.linkType === selectedLinkType
                )
            )
            .filter(
              (d: Doc) =>
                !searchQuery ||
                d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.slug.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((d: Doc) => ({
              id: d.slug,
              title: d.title,
              type: 'doc' as const,
            }))
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
    searchQuery,
    entityId,
    existingLinks,
    selectedLinkType,
  ])

  useEffect(() => {
    searchEntities()
  }, [searchEntities])

  return { searchResults, loadingSearch }
}
