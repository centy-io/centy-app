import type { ProjectInfo } from '@/gen/centy_pb'

export interface ArchivedProjectActions {
  archivedProjects: ProjectInfo[]
  archivedPathsNotInDaemon: string[]
  loading: boolean
  error: string | null
  removingPath: string | null
  confirmRemove: string | null
  confirmRemoveAll: boolean
  removingAll: boolean
  hasArchivedProjects: boolean
  handleRestore: (projectPath: string) => void
  handleRestoreAndSelect: (project: ProjectInfo) => void
  handleRemove: (projectPath: string) => Promise<void>
  handleRemoveStale: (path: string) => void
  handleRemoveAll: () => Promise<void>
  setConfirmRemove: (v: string | null) => void
  setConfirmRemoveAll: (v: boolean) => void
}
