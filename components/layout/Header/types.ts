import type { RouteLiteral } from 'nextjs-routes'

export interface NavLinks {
  assets: RouteLiteral
  users: RouteLiteral
  config: RouteLiteral
}

export interface NavItemType {
  name: string
  plural: string
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
