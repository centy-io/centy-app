'use client'

import { create } from '@bufbuild/protobuf'
import { centyClient } from './grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'
import type { ProjectResolution, ProjectCache } from './project-resolver.types'

export type { ProjectResolution } from './project-resolver.types'

const CACHE_TTL_MS = 30_000 // 30 seconds
let projectCache: ProjectCache | null = null

/**
 * The "ungrouped" org marker used in URLs
 */
export const UNGROUPED_ORG_MARKER = '_'

/**
 * Fetch all projects from daemon, with caching
 */
async function fetchProjects(): Promise<ProjectInfo[]> {
  const now = Date.now()

  if (projectCache && now - projectCache.timestamp < CACHE_TTL_MS) {
    return projectCache.projects
  }

  try {
    const request = create(ListProjectsRequestSchema, {})
    const response = await centyClient.listProjects(request)
    const projects = response.projects

    projectCache = {
      projects,
      timestamp: now,
    }

    return projects
  } catch (error) {
    if (projectCache) {
      console.warn(
        '[ProjectResolver] Failed to refresh, using stale cache:',
        error
      )
      return projectCache.projects
    }
    throw error
  }
}

/**
 * Invalidate the project cache (call when projects change)
 */
export function invalidateProjectCache(): void {
  projectCache = null
}

/**
 * Resolve a project from URL params to full project info
 */
export async function resolveProject(
  orgSlug: string,
  projectName: string
): Promise<ProjectResolution | null> {
  const projects = await fetchProjects()
  const targetOrgSlug = orgSlug === UNGROUPED_ORG_MARKER ? '' : orgSlug

  const project = projects.find(
    p => p.name === projectName && p.organizationSlug === targetOrgSlug
  )

  if (!project) {
    return null
  }

  return {
    projectPath: project.path,
    projectName: project.name,
    orgSlug: project.organizationSlug || null,
    initialized: project.initialized,
    displayPath: project.displayPath,
  }
}

/**
 * Resolve a project path to org slug and project name for URL construction
 */
export async function resolveProjectPath(
  projectPath: string
): Promise<{ orgSlug: string; projectName: string } | null> {
  const projects = await fetchProjects()
  const project = projects.find(p => p.path === projectPath)

  if (!project) {
    return null
  }

  return {
    orgSlug: project.organizationSlug || UNGROUPED_ORG_MARKER,
    projectName: project.name,
  }
}

/**
 * Get all projects, optionally filtered by org
 */
export async function getProjects(orgSlug?: string): Promise<ProjectInfo[]> {
  const projects = await fetchProjects()

  if (orgSlug === undefined) {
    return projects
  }

  const targetOrgSlug = orgSlug === UNGROUPED_ORG_MARKER ? '' : orgSlug
  return projects.filter(p => p.organizationSlug === targetOrgSlug)
}

/**
 * Build URL path from org slug and project name
 */
export function buildProjectPath(
  orgSlug: string | null,
  projectName: string
): string {
  const org = orgSlug || UNGROUPED_ORG_MARKER
  return `/${org}/${projectName}`
}

/**
 * Build full URL for a page within a project
 */
export function buildProjectPagePath(
  orgSlug: string | null,
  projectName: string,
  page: string,
  ...segments: string[]
): string {
  const base = buildProjectPath(orgSlug, projectName)
  const pagePath = [page, ...segments].filter(Boolean).join('/')
  return `${base}/${pagePath}`
}
