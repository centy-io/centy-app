'use client'

import type { Issue } from '@/gen/centy_pb'

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Resolve an issue by UUID, display number, or slug ID.
 * Tries UUID match first, then display number (if pure digits), then slug.
 */
export function findIssueByFlexibleId(
  issues: Issue[],
  id: string
): Issue | undefined {
  // Try UUID match
  const byId = issues.find(i => i.id === id)
  if (byId) return byId

  // Try display number (pure digits)
  if (/^\d+$/.test(id)) {
    const num = parseInt(id, 10)
    const byNumber = issues.find(i => i.displayNumber === num)
    if (byNumber) return byNumber
  }

  // Try slug match (derived from title)
  return issues.find(i => titleToSlug(i.title) === id)
}
