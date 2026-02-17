import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListDocsRequestSchema } from '@/gen/centy_pb'
import { getProjects } from '@/lib/project-resolver'
import type { AggregateDoc } from './AggregateDocsList.types'

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
          const request = create(ListDocsRequestSchema, {
            projectPath: project.path,
          })
          const response = await centyClient.listDocs(request)
          return response.docs.map(doc => ({
            ...doc,
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
        const dateA = a.metadata?.updatedAt
          ? new Date(a.metadata.updatedAt).getTime()
          : 0
        const dateB = b.metadata?.updatedAt
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { docs, loading, error, fetchAllDocs }
}
