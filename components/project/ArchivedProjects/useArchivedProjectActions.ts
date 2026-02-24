'use client'

import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { useRemoveArchivedProjects } from './useRemoveArchivedProjects'
import { useFetchAllProjects } from './useFetchAllProjects'
import { type ProjectInfo } from '@/gen/centy_pb'
import {
  useArchivedProjects,
  useProject,
} from '@/components/providers/ProjectProvider'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

export function useArchivedProjectActions() {
  const router = useRouter()
  const { archivedPaths, unarchiveProject, removeArchivedProject } =
    useArchivedProjects()
  const { setProjectPath, setIsInitialized } = useProject()
  const {
    allProjects,
    setAllProjects,
    loading,
    error: fetchError,
  } = useFetchAllProjects()

  const archivedProjects = allProjects.filter(p =>
    archivedPaths.includes(p.path)
  )
  const archivedPathsNotInDaemon = archivedPaths.filter(
    path => !allProjects.some(p => p.path === path)
  )

  const removeState = useRemoveArchivedProjects({
    archivedProjects,
    archivedPathsNotInDaemon,
    archivedPaths,
    removeArchivedProject,
    setAllProjects,
  })

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

  const hasArchivedProjects =
    archivedProjects.length > 0 || archivedPathsNotInDaemon.length > 0

  return {
    archivedProjects,
    archivedPathsNotInDaemon,
    loading,
    error: removeState.error || fetchError,
    removingPath: removeState.removingPath,
    confirmRemove: removeState.confirmRemove,
    confirmRemoveAll: removeState.confirmRemoveAll,
    removingAll: removeState.removingAll,
    hasArchivedProjects,
    handleRestore,
    handleRestoreAndSelect,
    handleRemove: removeState.handleRemove,
    handleRemoveStale: removeState.handleRemoveStale,
    handleRemoveAll: removeState.handleRemoveAll,
    setConfirmRemove: removeState.setConfirmRemove,
    setConfirmRemoveAll: removeState.setConfirmRemoveAll,
  }
}
