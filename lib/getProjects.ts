'use client'

import { projectResolverState } from './projectResolverState'
import { UNGROUPED_ORG_MARKER } from './UNGROUPED_ORG_MARKER'
import type { ProjectInfo } from '@/gen/centy_pb'

/**
 * Get all projects, optionally filtered by org
 */
export async function getProjects(orgSlug?: string): Promise<ProjectInfo[]> {
  const projects = await projectResolverState.fetchProjects()

  if (orgSlug === undefined) {
    return projects
  }

  const targetOrgSlug = orgSlug === UNGROUPED_ORG_MARKER ? '' : orgSlug
  return projects.filter(p => p.organizationSlug === targetOrgSlug)
}
