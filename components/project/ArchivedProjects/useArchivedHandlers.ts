'use client'

import type { ProjectInfo } from '@/gen/centy_pb'
import { untrackProject, untrackAllProjects } from './archivedProjectActions'

interface UseArchivedHandlersParams {
  archivedPaths: string[]
  archivedProjects: ProjectInfo[]
  archivedPathsNotInDaemon: string[]
  unarchiveProject: (path: string) => void
  removeArchivedProject: (path: string) => void
  setProjectPath: (path: string) => void
  setIsInitialized: (v: boolean) => void
  setAllProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>
  setError: (v: string | null) => void
  setRemovingPath: (v: string | null) => void
  setConfirmRemove: (v: string | null) => void
  setRemovingAll: (v: boolean) => void
  setConfirmRemoveAll: (v: boolean) => void
}

export function useArchivedHandlers(params: UseArchivedHandlersParams) {
  const handleRestore = (projectPath: string) => {
    params.unarchiveProject(projectPath)
  }
  const handleRestoreAndSelect = (project: ProjectInfo) => {
    params.unarchiveProject(project.path)
    params.setProjectPath(project.path)
    params.setIsInitialized(project.initialized)
  }
  const handleRemove = async (projectPath: string) => {
    params.setRemovingPath(projectPath)
    params.setError(null)
    try {
      const res = await untrackProject(projectPath)
      if (!res.success && res.error) {
        params.setError(res.error)
      } else {
        params.removeArchivedProject(projectPath)
        params.setAllProjects(prev => prev.filter(p => p.path !== projectPath))
      }
    } catch (err) {
      params.setError(
        err instanceof Error ? err.message : 'Failed to remove project'
      )
    } finally {
      params.setRemovingPath(null)
      params.setConfirmRemove(null)
    }
  }
  const handleRemoveStale = (path: string) => {
    params.removeArchivedProject(path)
    params.setConfirmRemove(null)
  }
  const handleRemoveAll = async () => {
    params.setRemovingAll(true)
    params.setError(null)
    try {
      const err = await untrackAllProjects(
        params.archivedProjects,
        params.archivedPathsNotInDaemon,
        params.removeArchivedProject
      )
      if (err) {
        params.setError(err)
        return
      }
      params.setAllProjects(prev =>
        prev.filter(p => !params.archivedPaths.includes(p.path))
      )
    } catch (err) {
      params.setError(
        err instanceof Error ? err.message : 'Failed to remove all projects'
      )
    } finally {
      params.setRemovingAll(false)
      params.setConfirmRemoveAll(false)
    }
  }

  return {
    handleRestore,
    handleRestoreAndSelect,
    handleRemove,
    handleRemoveStale,
    handleRemoveAll,
  }
}
