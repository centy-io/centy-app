import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import type { AggregateDoc } from './AggregateDoc'
import { centyClient } from '@/lib/grpc/client'
import { ListItemsRequestSchema } from '@/gen/centy_pb'
import { genericItemToDoc } from '@/lib/genericItemToDoc'
import { getProjects } from '@/lib/project-resolver'

export function useAggregateDocsData() {
  const [docs, setDocs] = useState<AggregateDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllDocs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const projects = await getProjects()
      const initializedProjects = projects.filter(p => p.initialized)

      const docPromises = initializedProjects.map(async project => {
        try {
          const request = create(ListItemsRequestSchema, {
            projectPath: project.path,
            itemType: 'docs',
          })
          const response = await centyClient.listItems(request)
          return response.items.map(item => ({
            ...genericItemToDoc(item),
            projectName: project.name,
            orgSlug: project.organizationSlug || null,
            projectPath: project.path,
          }))
        } catch {
          console.warn(`Failed to fetch docs from ${project.name}`)
          return []
        }
      })

      const docArrays = await Promise.all(docPromises)
      const allDocs = docArrays.flat()

      allDocs.sort((a, b) => {
        const dateA =
          a.metadata && a.metadata.updatedAt
            ? new Date(a.metadata.updatedAt).getTime()
            : 0
        const dateB =
          b.metadata && b.metadata.updatedAt
            ? new Date(b.metadata.updatedAt).getTime()
            : 0
        return dateB - dateA
      })

      setDocs(allDocs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch docs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllDocs()
  }, [fetchAllDocs])

  return {
    docs,
    loading,
    error,
    fetchAllDocs,
  }
}
