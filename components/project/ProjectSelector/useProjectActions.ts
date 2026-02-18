/* eslint-disable max-lines */
'use client'

import { useCallback } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  RegisterProjectRequestSchema,
  SetProjectFavoriteRequestSchema,
  type ProjectInfo,
} from '@/gen/centy_pb'
import {
  useProject,
  useArchivedProjects,
} from '@/components/providers/ProjectProvider'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'
import { ROOT_ROUTES } from './ProjectSelector.types'

interface UseProjectActionsParams {
  projects: ProjectInfo[]
  setProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>
  setIsOpen: (v: boolean) => void
  setSearchQuery: (v: string) => void
  setManualPath: (v: string) => void
  manualPath: string
}

// eslint-disable-next-line max-lines-per-function
export function useProjectActions(params: UseProjectActionsParams) {
  const router = useRouter()
  const routeParams = useParams()
  const pathname = usePathname()
  const { projectPath, setProjectPath, setIsInitialized } = useProject()
  const { archiveProject } = useArchivedProjects()

  const getCurrentPage = useCallback(() => {
    const orgP = routeParams ? routeParams.organization : undefined
    const org = typeof orgP === 'string' ? orgP : undefined
    const projP = routeParams ? routeParams.project : undefined
    const proj = typeof projP === 'string' ? projP : undefined
    const segments = pathname.split('/').filter(Boolean)
    if (org && proj) return segments[2] || 'issues'
    if (segments.length >= 2 && !ROOT_ROUTES.has(segments[0]))
      return segments[2] || 'issues'
    return segments[0] || 'issues'
  }, [routeParams, pathname])

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

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!params.manualPath.trim()) return
    const path = params.manualPath.trim()
    try {
      const req = create(RegisterProjectRequestSchema, { projectPath: path })
      const res = await centyClient.registerProject(req)
      if (res.success && res.project) {
        setProjectPath(path)
        setIsInitialized(res.project.initialized)
        params.setProjects(prev =>
          prev.some(p => p.path === path) ? prev : [...prev, res.project!]
        )
      } else {
        setProjectPath(path)
        setIsInitialized(null)
      }
    } catch {
      setProjectPath(path)
      setIsInitialized(null)
    }
    params.setManualPath('')
    params.setSearchQuery('')
    params.setIsOpen(false)
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

  const handleToggleFavorite = async (
    e: React.MouseEvent,
    project: ProjectInfo
  ) => {
    e.stopPropagation()
    try {
      const req = create(SetProjectFavoriteRequestSchema, {
        projectPath: project.path,
        isFavorite: !project.isFavorite,
      })
      const res = await centyClient.setProjectFavorite(req)
      if (res.success && res.project)
        params.setProjects(prev =>
          prev.map(p => (p.path === project.path ? res.project! : p))
        )
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    }
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
