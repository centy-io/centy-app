'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'

export function useArchivedProjectFetch(archivedPaths: string[]) {
  const [allProjects, setAllProjects] = useState<ProjectInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const request = create(ListProjectsRequestSchema, { includeStale: true })
      const response = await centyClient.listProjects(request)
      setAllProjects(response.projects)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const archivedProjects = allProjects.filter(p =>
    archivedPaths.includes(p.path)
  )
  const archivedPathsNotInDaemon = archivedPaths.filter(
    path => !allProjects.some(p => p.path === path)
  )

  return {
    allProjects,
    setAllProjects,
    loading,
    error,
    setError,
    archivedProjects,
    archivedPathsNotInDaemon,
  }
}
