import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  RegisterProjectRequestSchema,
  SetProjectFavoriteRequestSchema,
  type ProjectInfo,
} from '@/gen/centy_pb'
import { COLLAPSED_ORGS_KEY, ROOT_ROUTES } from './ProjectSelector.types'

export async function registerProject(path: string) {
  const req = create(RegisterProjectRequestSchema, { projectPath: path })
  return centyClient.registerProject(req)
}

export function getProjectDisplayName(
  projectPath: string,
  projects: ProjectInfo[]
) {
  if (!projectPath) return 'Select Project'
  const p = projects.find(p => p.path === projectPath)
  return p?.name || projectPath.split('/').pop() || projectPath
}

export function getCurrentPage(
  params: Record<string, string | string[] | undefined> | null,
  pathname: string
) {
  const org = params?.organization as string | undefined
  const proj = params?.project as string | undefined
  const segments = pathname.split('/').filter(Boolean)
  if (org && proj) return segments[2] || 'issues'
  if (segments.length >= 2 && !ROOT_ROUTES.has(segments[0]))
    return segments[2] || 'issues'
  return segments[0] || 'issues'
}

export function persistCollapsedOrgs(orgs: Set<string>) {
  try {
    localStorage.setItem(COLLAPSED_ORGS_KEY, JSON.stringify([...orgs]))
  } catch {
    /* */
  }
}

export async function toggleFavorite(p: ProjectInfo) {
  const req = create(SetProjectFavoriteRequestSchema, {
    projectPath: p.path,
    isFavorite: !p.isFavorite,
  })
  return centyClient.setProjectFavorite(req)
}
