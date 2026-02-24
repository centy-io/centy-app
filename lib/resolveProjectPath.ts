'use client'

import { projectResolverState } from './projectResolverState'
import { UNGROUPED_ORG_MARKER } from './UNGROUPED_ORG_MARKER'

/**
 * Resolve a project path to org slug and project name for URL construction
 */
export async function resolveProjectPath(
  projectPath: string
): Promise<{ orgSlug: string; projectName: string } | null> {
  const projects = await projectResolverState.fetchProjects()
  const project = projects.find(p => p.path === projectPath)

  if (!project) {
    return null
  }

  return {
    orgSlug: project.organizationSlug || UNGROUPED_ORG_MARKER,
    projectName: project.name,
  }
}
