'use client'

import { useParams } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import { ROOT_ROUTES } from './ProjectSelector.types'
import { centyClient } from '@/lib/grpc/client'
import {
  RegisterProjectRequestSchema,
  SetProjectFavoriteRequestSchema,
  type ProjectInfo,
} from '@/gen/centy_pb'

function getCurrentPageFromRoute(
  routeParams: ReturnType<typeof useParams>,
  pathname: string
): string {
  const orgP = routeParams ? routeParams.organization : undefined
  const org = typeof orgP === 'string' ? orgP : undefined
  const projP = routeParams ? routeParams.project : undefined
  const proj = typeof projP === 'string' ? projP : undefined
  const segments = pathname.split('/').filter(Boolean)
  if (org && proj) return segments[2] || 'issues'
  if (segments.length >= 2 && !ROOT_ROUTES.has(segments[0]))
    return segments[2] || 'issues'
  return segments[0] || 'issues'
}

async function registerProject(path: string): Promise<ProjectInfo | null> {
  const req = create(RegisterProjectRequestSchema, { projectPath: path })
  const res = await centyClient.registerProject(req)
  if (res.success && res.project) return res.project
  return null
}

async function toggleFavoriteRequest(
  project: ProjectInfo
): Promise<ProjectInfo | null> {
  const req = create(SetProjectFavoriteRequestSchema, {
    projectPath: project.path,
    isFavorite: !project.isFavorite,
  })
  const res = await centyClient.setProjectFavorite(req)
  if (res.success && res.project) return res.project
  return null
}

async function handleManualSubmitAction(
  path: string,
  setProjectPath: (p: string) => void,
  setIsInitialized: (v: boolean | null) => void,
  setProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>
): Promise<void> {
  try {
    const project = await registerProject(path)
    if (project) {
      setProjectPath(path)
      setIsInitialized(project.initialized)
      setProjects(prev =>
        prev.some(p => p.path === path) ? prev : [...prev, project]
      )
    } else {
      setProjectPath(path)
      setIsInitialized(null)
    }
  } catch {
    setProjectPath(path)
    setIsInitialized(null)
  }
}

export const projectSelectorApi = {
  getCurrentPageFromRoute,
  registerProject,
  toggleFavoriteRequest,
  handleManualSubmitAction,
}
