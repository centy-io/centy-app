'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'
import {
  useArchivedProjects as useArchivedProjectsProvider,
  useProject,
} from '@/components/providers/ProjectProvider'
import { untrackProject, untrackAllProjects } from './archivedProjectActions'
import { useArchivedHandlers } from './useArchivedHandlers'

export function useArchivedProjectsList() {
  const { archivedPaths, unarchiveProject, removeArchivedProject } =
    useArchivedProjectsProvider()
  const { setProjectPath, setIsInitialized } = useProject()
  const [allProjects, setAllProjects] = useState<ProjectInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingPath, setRemovingPath] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)
  const [confirmRemoveAll, setConfirmRemoveAll] = useState(false)
  const [removingAll, setRemovingAll] = useState(false)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const req = create(ListProjectsRequestSchema, { includeStale: true })
      setAllProjects((await centyClient.listProjects(req)).projects)
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
  const hasArchivedProjects =
    archivedProjects.length > 0 || archivedPathsNotInDaemon.length > 0

  const handlers = useArchivedHandlers({
    archivedPaths,
    archivedProjects,
    archivedPathsNotInDaemon,
    unarchiveProject,
    removeArchivedProject,
    setProjectPath,
    setIsInitialized,
    setAllProjects,
    setError,
    setRemovingPath,
    setConfirmRemove,
    setRemovingAll,
    setConfirmRemoveAll,
  })

  return {
    loading,
    error,
    archivedProjects,
    archivedPathsNotInDaemon,
    hasArchivedProjects,
    removingPath,
    confirmRemove,
    setConfirmRemove,
    confirmRemoveAll,
    setConfirmRemoveAll,
    removingAll,
    ...handlers,
  }
}
