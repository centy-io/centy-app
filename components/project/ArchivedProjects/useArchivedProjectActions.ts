'use client'

import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { useArchivedProjectFetch } from './useArchivedProjectFetch'
import { useArchivedProjectMutations } from './useArchivedProjectMutations'
import {
  useArchivedProjects,
  useProject,
} from '@/components/providers/ProjectProvider'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'
import type { ProjectInfo } from '@/gen/centy_pb'

export function useArchivedProjectActions() {
  const router = useRouter()
  const { archivedPaths, unarchiveProject, removeArchivedProject } =
    useArchivedProjects()
  const { setProjectPath, setIsInitialized } = useProject()

  const fetch = useArchivedProjectFetch(archivedPaths)
  const mutations = useArchivedProjectMutations({
    archivedPaths,
    archivedProjects: fetch.archivedProjects,
    archivedPathsNotInDaemon: fetch.archivedPathsNotInDaemon,
    removeArchivedProject,
    setAllProjects: fetch.setAllProjects,
    fetchError: fetch.error,
  })

  const handleRestore = (projectPath: string): void => {
    unarchiveProject(projectPath)
  }

  const handleRestoreAndSelect = (project: ProjectInfo): void => {
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

  const hasArchivedProjects =
    fetch.archivedProjects.length > 0 ||
    fetch.archivedPathsNotInDaemon.length > 0

  return {
    archivedProjects: fetch.archivedProjects,
    archivedPathsNotInDaemon: fetch.archivedPathsNotInDaemon,
    loading: fetch.loading,
    error: mutations.error,
    removingPath: mutations.removingPath,
    confirmRemove: mutations.confirmRemove,
    confirmRemoveAll: mutations.confirmRemoveAll,
    removingAll: mutations.removingAll,
    hasArchivedProjects,
    handleRestore,
    handleRestoreAndSelect,
    handleRemove: mutations.handleRemove,
    handleRemoveStale: mutations.handleRemoveStale,
    handleRemoveAll: mutations.handleRemoveAll,
    setConfirmRemove: mutations.setConfirmRemove,
    setConfirmRemoveAll: mutations.setConfirmRemoveAll,
  }
}
