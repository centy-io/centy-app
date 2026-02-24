'use client'

import { route } from 'nextjs-routes'
import type { NavLinks } from './types'

export function buildNavLinks(
  hasProjectContext: boolean,
  effectiveOrg: string | undefined,
  effectiveProject: string | undefined
): NavLinks | null {
  if (!hasProjectContext || !effectiveOrg || !effectiveProject) return null
  return {
    assets: route({
      pathname: '/[organization]/[project]/assets',
      query: { organization: effectiveOrg, project: effectiveProject },
    }),
    users: route({
      pathname: '/[organization]/[project]/users',
      query: { organization: effectiveOrg, project: effectiveProject },
    }),
    config: route({
      pathname: '/[organization]/[project]/config',
      query: { organization: effectiveOrg, project: effectiveProject },
    }),
  }
}
