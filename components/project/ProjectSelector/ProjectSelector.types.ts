import type { ProjectInfo } from '@/gen/centy_pb'

export const COLLAPSED_ORGS_KEY = 'centy-collapsed-orgs'

// Known root-level routes that are NOT org/project paths
export const ROOT_ROUTES = new Set([
  'organizations',
  'settings',
  'archived',
  'assets',
  'project',
])

export interface GroupedProjectEntry {
  name: string
  projects: ProjectInfo[]
}
