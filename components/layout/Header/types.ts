import type { RouteLiteral } from 'nextjs-routes'

export interface NavLinks {
  issues: RouteLiteral
  docs: RouteLiteral
  assets: RouteLiteral
  users: RouteLiteral
  config: RouteLiteral
}

/**
 * Known root-level routes that are NOT org/project paths
 */
export const ROOT_ROUTES = new Set([
  'organizations',
  'settings',
  'archived',
  'assets',
  'project',
])
