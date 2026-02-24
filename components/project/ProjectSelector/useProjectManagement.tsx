'use client'

import { create } from '@bufbuild/protobuf'
import { registerProjectPath } from './registerProjectPath'
import { centyClient } from '@/lib/grpc/client'
import {
  SetProjectFavoriteRequestSchema,
  type ProjectInfo,
} from '@/gen/centy_pb'

interface UseProjectManagementParams {
  setProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>
  setIsOpen: (v: boolean) => void
  setSearchQuery: (v: string) => void
  setManualPath: (v: string) => void
  manualPath: string
  setProjectPath: (path: string) => void
  setIsInitialized: (v: boolean | null) => void
}

export function useProjectManagement({
  setProjects,
  setIsOpen,
  setSearchQuery,
  setManualPath,
  manualPath,
  setProjectPath,
  setIsInitialized,
}: UseProjectManagementParams) {
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualPath.trim()) return
    const path = manualPath.trim()
    try {
      const res = await registerProjectPath(path)
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
        setProjects(prev =>
          prev.map(p => (p.path === project.path ? res.project! : p))
        )
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    }
  }

  return { handleManualSubmit, handleToggleFavorite }
}
