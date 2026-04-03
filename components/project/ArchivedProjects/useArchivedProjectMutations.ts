'use client'

import { useState } from 'react'
import { untrackProjectHelpers } from './untrackProjectHelpers'
import { performRemoveAll } from './performRemoveAll'
import type { ProjectInfo } from '@/gen/centy_pb'

const { removeProjectFromDaemon } = untrackProjectHelpers

interface UseArchivedProjectMutationsParams {
  archivedPaths: string[]
  archivedProjects: ProjectInfo[]
  archivedPathsNotInDaemon: string[]
  removeArchivedProject: (path: string) => void
  setAllProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>
  fetchError: string | null
}

export function useArchivedProjectMutations({
  archivedPaths,
  archivedProjects,
  archivedPathsNotInDaemon,
  removeArchivedProject,
  setAllProjects,
  fetchError,
}: UseArchivedProjectMutationsParams) {
  const [mutationError, setMutationError] = useState<string | null>(null)
  const [removingPath, setRemovingPath] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)
  const [confirmRemoveAll, setConfirmRemoveAll] = useState(false)
  const [removingAll, setRemovingAll] = useState(false)

  const error = mutationError ?? fetchError

  const handleRemove = async (projectPath: string): Promise<void> => {
    setRemovingPath(projectPath)
    setMutationError(null)
    try {
      await removeProjectFromDaemon(
        projectPath,
        removeArchivedProject,
        setAllProjects,
        setMutationError
      )
    } catch (err) {
      setMutationError(
        err instanceof Error ? err.message : 'Failed to remove project'
      )
    } finally {
      setRemovingPath(null)
      setConfirmRemove(null)
    }
  }

  const handleRemoveStale = (path: string): void => {
    removeArchivedProject(path)
    setConfirmRemove(null)
  }

  const handleRemoveAll = (): Promise<void> =>
    performRemoveAll({
      archivedProjects,
      archivedPathsNotInDaemon,
      archivedPaths,
      removeArchivedProject,
      setAllProjects,
      setRemovingAll,
      setMutationError,
      setConfirmRemoveAll,
    })

  return {
    error,
    removingPath,
    confirmRemove,
    confirmRemoveAll,
    removingAll,
    handleRemove,
    handleRemoveStale,
    handleRemoveAll,
    setConfirmRemove,
    setConfirmRemoveAll,
  }
}
