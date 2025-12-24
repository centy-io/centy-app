'use client'

import { create } from '@bufbuild/protobuf'
import { centyClient } from './grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'

/**
 * Resolution result for a project lookup
 */
export interface ProjectResolution {
  /** Absolute filesystem path for API calls */
  projectPath: string
  /** Project name (directory name) */
  projectName: string
  /** Organization slug (null if ungrouped) */
  orgSlug: string | null
  /** Whether project has .centy folder */
  initialized: boolean
  /** Display path (with ~/ for home) */
  displayPath: string
}

/**
 * Cache for project list with TTL
 */
interface ProjectCache {
  projects: ProjectInfo[]
  timestamp: number
}

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

  // Return cached if still valid
  if (projectCache && now - projectCache.timestamp < CACHE_TTL_MS) {
    return projectCache.projects
  }

  try {
    const request = create(ListProjectsRequestSchema, {})
    const response = await centyClient.listProjects(request)
    const projects = response.projects

    // Update cache
    projectCache = {
      projects,
      timestamp: now,
    }

    return projects
  } catch (error) {
    // If fetch fails but we have stale cache, use it
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
 * Resolve a project from URL params (org slug + project name) to full project info
 *
 * @param orgSlug - Organization slug from URL (use UNGROUPED_ORG_MARKER for ungrouped)
 * @param projectName - Project name (directory name) from URL
 * @returns ProjectResolution or null if not found
 */
export async function resolveProject(
  orgSlug: string,
  projectName: string
): Promise<ProjectResolution | null> {
  const projects = await fetchProjects()

  // Normalize org slug: "_" means ungrouped (empty string)
  const targetOrgSlug = orgSlug === UNGROUPED_ORG_MARKER ? '' : orgSlug

  // Find matching project
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
 *
 * @param projectPath - Absolute filesystem path
 * @returns {orgSlug, projectName} or null if not found
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

  // Normalize: "_" means ungrouped
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
