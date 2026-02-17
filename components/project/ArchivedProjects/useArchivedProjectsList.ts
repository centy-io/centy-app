'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  UntrackProjectRequestSchema,
  type ProjectInfo,
} from '@/gen/centy_pb'
import {
  useArchivedProjects as useArchivedProjectsProvider,
  useProject,
} from '@/components/providers/ProjectProvider'

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

  const handleRestore = (projectPath: string) => {
    unarchiveProject(projectPath)
  }
  const handleRestoreAndSelect = (project: ProjectInfo) => {
    unarchiveProject(project.path)
    setProjectPath(project.path)
    setIsInitialized(project.initialized)
  }
  const handleRemove = async (projectPath: string) => {
    setRemovingPath(projectPath)
    setError(null)
    try {
      const req = create(UntrackProjectRequestSchema, { projectPath })
      const res = await centyClient.untrackProject(req)
      if (!res.success && res.error) {
        setError(res.error)
      } else {
        removeArchivedProject(projectPath)
        setAllProjects(prev => prev.filter(p => p.path !== projectPath))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove project')
    } finally {
      setRemovingPath(null)
      setConfirmRemove(null)
    }
  }
  const handleRemoveStale = (path: string) => {
    removeArchivedProject(path)
    setConfirmRemove(null)
  }
  const handleRemoveAll = async () => {
    setRemovingAll(true)
    setError(null)
    try {
      for (const p of archivedProjects) {
        const req = create(UntrackProjectRequestSchema, { projectPath: p.path })
        const res = await centyClient.untrackProject(req)
        if (!res.success && res.error) {
          setError(res.error)
          setRemovingAll(false)
          setConfirmRemoveAll(false)
          return
        }
        removeArchivedProject(p.path)
      }
      for (const path of archivedPathsNotInDaemon) removeArchivedProject(path)
      setAllProjects(prev => prev.filter(p => !archivedPaths.includes(p.path)))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to remove all projects'
      )
    } finally {
      setRemovingAll(false)
      setConfirmRemoveAll(false)
    }
  }

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
    handleRestore,
    handleRestoreAndSelect,
    handleRemove,
    handleRemoveStale,
    handleRemoveAll,
  }
}
