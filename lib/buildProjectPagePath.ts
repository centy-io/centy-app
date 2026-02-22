'use client'

import { buildProjectPath } from './buildProjectPath'

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
