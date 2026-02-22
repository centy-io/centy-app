'use client'

import { UNGROUPED_ORG_MARKER } from './UNGROUPED_ORG_MARKER'

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
