'use client'

import { useCallback } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { route } from 'nextjs-routes'
import { getCurrentPageFromParams } from './getCurrentPage'
import { useProjectManagement } from './useProjectManagement'
import { type ProjectInfo } from '@/gen/centy_pb'
import {
  useProject,
  useArchivedProjects,
} from '@/components/providers/ProjectProvider'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

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

  const getCurrentPage = useCallback(
    () => getCurrentPageFromParams(routeParams, pathname),
    [routeParams, pathname]
  )

  const { handleManualSubmit, handleToggleFavorite } = useProjectManagement({
    setProjects: params.setProjects,
    setIsOpen: params.setIsOpen,
    setSearchQuery: params.setSearchQuery,
    setManualPath: params.setManualPath,
    manualPath: params.manualPath,
    setProjectPath,
    setIsInitialized,
  })

  const handleSelectProject = (project: ProjectInfo) => {
    const orgSlug = project.organizationSlug || UNGROUPED_ORG_MARKER
    const page = getCurrentPage()
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

  const getCurrentProjectName = () => {
    if (!projectPath) return 'Select Project'
    const p = params.projects.find(p => p.path === projectPath)
    if (p && p.name) return p.name
    const parts = projectPath.split('/')
    return parts[parts.length - 1] || projectPath
  }

  const handleArchiveProject = (e: React.MouseEvent, proj: ProjectInfo) => {
    e.stopPropagation()
    archiveProject(proj.path)
    if (proj.path !== projectPath) return
    setProjectPath('')
    setIsInitialized(null)
  }

  return {
    projectPath,
    handleSelectProject,
    handleManualSubmit,
    getCurrentProjectName,
    handleArchiveProject,
    handleToggleFavorite,
  }
}
