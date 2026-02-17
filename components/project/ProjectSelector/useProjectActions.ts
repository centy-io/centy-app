'use client'

import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import {
  useProject,
  useArchivedProjects,
} from '@/components/providers/ProjectProvider'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'
import type { ProjectInfo } from '@/gen/centy_pb'
import {
  registerProject,
  toggleFavorite,
  getProjectDisplayName,
} from './projectSelectorActions'

export function useProjectActions(
  projects: ProjectInfo[],
  setProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>,
  getCurrentPage: () => string,
  setIsOpen: (v: boolean) => void,
  setSearchQuery: (v: string) => void,
  manualPath: string,
  setManualPath: (v: string) => void
) {
  const router = useRouter()
  const { projectPath, setProjectPath, setIsInitialized } = useProject()
  const { archiveProject } = useArchivedProjects()

  const handleSelectProject = (p: ProjectInfo) => {
    setProjectPath(p.path)
    setIsInitialized(p.initialized)
    router.push(
      route({
        pathname: '/[...path]',
        query: {
          path: [
            p.organizationSlug || UNGROUPED_ORG_MARKER,
            p.name,
            getCurrentPage(),
          ],
        },
      })
    )
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualPath.trim()) return
    const path = manualPath.trim()
    try {
      const res = await registerProject(path)
      if (res.success && res.project) {
        setProjectPath(path)
        setIsInitialized(res.project.initialized)
        setProjects(prev =>
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
    setManualPath('')
    setSearchQuery('')
    setIsOpen(false)
  }

  const getCurrentProjectName = () =>
    getProjectDisplayName(projectPath, projects)

  const handleArchiveProject = (e: React.MouseEvent, p: ProjectInfo) => {
    e.stopPropagation()
    archiveProject(p.path)
    if (p.path === projectPath) {
      setProjectPath('')
      setIsInitialized(null)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent, p: ProjectInfo) => {
    e.stopPropagation()
    try {
      const res = await toggleFavorite(p)
      if (res.success && res.project) {
        setProjects(prev =>
          prev.map(x => (x.path === p.path ? res.project! : x))
        )
      }
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
