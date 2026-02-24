'use client'

import { useState } from 'react'
import { untrackProjectRequest } from './archivedProjectRequests'
import { useRemoveAllArchived } from './useRemoveAllArchived'
import { type ProjectInfo } from '@/gen/centy_pb'

interface UseRemoveArchivedProjectsParams {
  archivedProjects: ProjectInfo[]
  archivedPathsNotInDaemon: string[]
  archivedPaths: string[]
  removeArchivedProject: (path: string) => void
  setAllProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>
}

export function useRemoveArchivedProjects({
  archivedProjects,
  archivedPathsNotInDaemon,
  archivedPaths,
  removeArchivedProject,
  setAllProjects,
}: UseRemoveArchivedProjectsParams) {
  const [error, setError] = useState<string | null>(null)
  const [removingPath, setRemovingPath] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)

  const {
    confirmRemoveAll,
    setConfirmRemoveAll,
    removingAll,
    handleRemoveAll,
  } = useRemoveAllArchived({
    archivedProjects,
    archivedPathsNotInDaemon,
    archivedPaths,
    removeArchivedProject,
    setAllProjects,
    setError,
  })

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

  return {
    error,
    setError,
    removingPath,
    confirmRemove,
    setConfirmRemove,
    confirmRemoveAll,
    setConfirmRemoveAll,
    removingAll,
    handleRemove,
    handleRemoveStale,
    handleRemoveAll,
  }
}
