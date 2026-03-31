'use client'

import { useRouter, useParams, usePathname } from 'next/navigation'
import { route } from 'nextjs-routes'
import { projectSelectorApi } from './projectSelectorApi'
import { toggleFavorite } from './toggleFavorite'
import type { ProjectInfo } from '@/gen/centy_pb'
import {
  useProject,
  useArchivedProjects,
} from '@/components/providers/ProjectProvider'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

const { getCurrentPageFromRoute, handleManualSubmitAction } = projectSelectorApi

interface UseProjectActionsParams {
  projects: ProjectInfo[]
  setProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>
  setIsOpen: (v: boolean) => void
  setSearchQuery: (v: string) => void
  setManualPath: (v: string) => void
  manualPath: string
}

export function useProjectActions(params: UseProjectActionsParams) {
  const router = useRouter()
  const routeParams = useParams()
  const pathname = usePathname()
  const { projectPath, setProjectPath, setIsInitialized } = useProject()
  const { archiveProject } = useArchivedProjects()

  const handleSelectProject = (project: ProjectInfo): void => {
    const orgSlug = project.organizationSlug || UNGROUPED_ORG_MARKER
    const page = getCurrentPageFromRoute(routeParams, pathname)
    setProjectPath(project.path)
    setIsInitialized(project.initialized)
    router.push(
      route({
        pathname: '/[...path]',
        query: { path: [orgSlug, project.name, page] },
      })
    )
    params.setIsOpen(false)
    params.setSearchQuery('')
  }

  const handleManualSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!params.manualPath.trim()) return
    const path = params.manualPath.trim()
    await handleManualSubmitAction(
      path,
      setProjectPath,
      setIsInitialized,
      params.setProjects
    )
    params.setManualPath('')
    params.setSearchQuery('')
    params.setIsOpen(false)
  }

  const getCurrentProjectName = (): string => {
    if (!projectPath) return 'Select Project'
    const p = params.projects.find(p => p.path === projectPath)
    if (p && p.name) return p.name
    const parts = projectPath.split('/')
    return parts[parts.length - 1] || projectPath
  }

  const handleArchiveProject = (
    e: React.MouseEvent,
    proj: ProjectInfo
  ): void => {
    e.stopPropagation()
    archiveProject(proj.path)
    if (proj.path !== projectPath) return
    setProjectPath('')
    setIsInitialized(null)
  }

  const handleToggleFavorite = (
    e: React.MouseEvent,
    project: ProjectInfo
  ): Promise<void> =>
    toggleFavorite({ e, project, setProjects: params.setProjects })

  return {
    projectPath,
    handleSelectProject,
    handleManualSubmit,
    getCurrentProjectName,
    handleArchiveProject,
    handleToggleFavorite,
  }
}
