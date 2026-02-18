import type { ProjectInfo } from '@/gen/centy_pb'

export const COLLAPSED_ORGS_KEY = 'centy-collapsed-orgs'

export const ROOT_ROUTES = new Set([
  'organizations',
  'settings',
  'archived',
  'assets',
  'project',
])

export interface ProjectGroup {
  name: string
  projects: ProjectInfo[]
}

export type GroupedProjects = [string, ProjectGroup][] | null
