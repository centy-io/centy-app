import type { RouteLiteral } from 'nextjs-routes'

// Known root-level routes that are NOT org/project paths
export const ROOT_ROUTES = new Set([
  'organizations',
  'settings',
  'archived',
  'assets',
  'project',
])

export interface NavLinks {
  issues: RouteLiteral
  docs: RouteLiteral
  assets: RouteLiteral
  users: RouteLiteral
  config: RouteLiteral
}
