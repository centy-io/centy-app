import { untrackProjectHelpers } from './untrackProjectHelpers'
import type { ProjectInfo } from '@/gen/centy_pb'

const { removeAllFromDaemon } = untrackProjectHelpers

interface PerformRemoveAllParams {
  archivedProjects: ProjectInfo[]
  archivedPathsNotInDaemon: string[]
  archivedPaths: string[]
  removeArchivedProject: (path: string) => void
  setAllProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>
  setRemovingAll: (v: boolean) => void
  setMutationError: (v: string | null) => void
  setConfirmRemoveAll: (v: boolean) => void
}

export async function performRemoveAll(
  params: PerformRemoveAllParams
): Promise<void> {
  const {
    archivedProjects,
    archivedPathsNotInDaemon,
    archivedPaths,
    removeArchivedProject,
    setAllProjects,
    setRemovingAll,
    setMutationError,
    setConfirmRemoveAll,
  } = params
  setRemovingAll(true)
  setMutationError(null)
  try {
    const err = await removeAllFromDaemon(
      archivedProjects,
      archivedPathsNotInDaemon,
      removeArchivedProject
    )
    if (err) {
      setMutationError(err)
    } else {
      setAllProjects(prev => prev.filter(p => !archivedPaths.includes(p.path)))
    }
  } catch (err) {
    setMutationError(
      err instanceof Error ? err.message : 'Failed to remove all projects'
    )
  } finally {
    setRemovingAll(false)
    setConfirmRemoveAll(false)
  }
}
