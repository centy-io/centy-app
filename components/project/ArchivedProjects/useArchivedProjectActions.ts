'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  UntrackProjectRequestSchema,
  type ProjectInfo,
} from '@/gen/centy_pb'
import {
  useArchivedProjects,
  useProject,
} from '@/components/providers/ProjectProvider'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

async function untrackProjectRequest(projectPath: string) {
  return centyClient.untrackProject(
    create(UntrackProjectRequestSchema, { projectPath })
  )
}

async function removeAllArchived(
  archivedProjects: ProjectInfo[],
  archivedPathsNotInDaemon: string[],
  removeArchivedProject: (path: string) => void
): Promise<string | null> {
  for (const project of archivedProjects) {
    const response = await untrackProjectRequest(project.path)
    if (!response.success && response.error) return response.error
    removeArchivedProject(project.path)
  }
  for (const path of archivedPathsNotInDaemon) {
    removeArchivedProject(path)
  }
  return null
}

export function useArchivedProjectActions() {
  const router = useRouter()
  const { archivedPaths, unarchiveProject, removeArchivedProject } =
    useArchivedProjects()
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
      const response = await centyClient.listProjects(
        create(ListProjectsRequestSchema, { includeStale: true })
      )
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

  const handleRestore = (projectPath: string) => {
    unarchiveProject(projectPath)
  }

  const handleRestoreAndSelect = (project: ProjectInfo) => {
    unarchiveProject(project.path)
    setProjectPath(project.path)
    setIsInitialized(project.initialized)
    const orgSlug = project.organizationSlug || UNGROUPED_ORG_MARKER
    router.push(
      route({
        pathname: '/[...path]',
        query: { path: [orgSlug, project.name, 'issues'] },
      })
    )
  }

  const handleRemove = async (projectPath: string) => {
    setRemovingPath(projectPath)
    setError(null)
    try {
      const response = await untrackProjectRequest(projectPath)
      if (!response.success && response.error) {
        setError(response.error)
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
      const err = await removeAllArchived(
        archivedProjects,
        archivedPathsNotInDaemon,
        removeArchivedProject
      )
      if (err) {
        setError(err)
        setRemovingAll(false)
        setConfirmRemoveAll(false)
        return
      }
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

  const hasArchivedProjects =
    archivedProjects.length > 0 || archivedPathsNotInDaemon.length > 0

  return {
    archivedProjects,
    archivedPathsNotInDaemon,
    loading,
    error,
    removingPath,
    confirmRemove,
    confirmRemoveAll,
    removingAll,
    hasArchivedProjects,
    handleRestore,
    handleRestoreAndSelect,
    handleRemove,
    handleRemoveStale,
    handleRemoveAll,
    setConfirmRemove,
    setConfirmRemoveAll,
  }
}
