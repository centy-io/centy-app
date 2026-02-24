'use client'

import { useState } from 'react'
import { removeAllArchived } from './archivedProjectRequests'
import { type ProjectInfo } from '@/gen/centy_pb'

interface UseRemoveAllArchivedParams {
  archivedProjects: ProjectInfo[]
  archivedPathsNotInDaemon: string[]
  archivedPaths: string[]
  removeArchivedProject: (path: string) => void
  setAllProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>
  setError: (e: string | null) => void
}

export function useRemoveAllArchived({
  archivedProjects,
  archivedPathsNotInDaemon,
  archivedPaths,
  removeArchivedProject,
  setAllProjects,
  setError,
}: UseRemoveAllArchivedParams) {
  const [confirmRemoveAll, setConfirmRemoveAll] = useState(false)
  const [removingAll, setRemovingAll] = useState(false)

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

  return { confirmRemoveAll, setConfirmRemoveAll, removingAll, handleRemoveAll }
}
