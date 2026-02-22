'use client'

import type { ProjectResolution } from './ProjectResolution'
import { projectResolverState } from './projectResolverState'
import { UNGROUPED_ORG_MARKER } from './UNGROUPED_ORG_MARKER'

/**
 * Resolve a project from URL params to full project info
 */
export async function resolveProject(
  orgSlug: string,
  projectName: string
): Promise<ProjectResolution | null> {
  const projects = await projectResolverState.fetchProjects()
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
