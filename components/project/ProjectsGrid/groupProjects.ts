import type { ProjectInfo, Organization } from '@/gen/centy_pb'
import type { ProjectGroup } from './types'

/**
 * Group projects by organization, sort groups and projects within each group
 */
export function groupProjects(
  projects: ProjectInfo[],
  organizations: Organization[]
): [string, ProjectGroup][] {
  const groups: Map<string, ProjectGroup> = new Map()

  groups.set('', { name: 'Ungrouped', projects: [] })

  for (const project of projects) {
    const orgSlug = project.organizationSlug || ''
    if (!groups.has(orgSlug)) {
      const org = organizations.find(o => o.slug === orgSlug)
      groups.set(orgSlug, { name: org?.name || orgSlug, projects: [] })
    }
    groups.get(orgSlug)!.projects.push(project)
  }

  // Sort: organizations first (alphabetically), then ungrouped
  // Filter out empty groups
  const sortedGroups = Array.from(groups.entries())
    .filter(([, g]) => g.projects.length > 0)
    .sort(([slugA], [slugB]) => {
      if (slugA === '' && slugB !== '') return 1
      if (slugA !== '' && slugB === '') return -1
      return slugA.localeCompare(slugB)
    })

  // Sort projects within each group: favorites first, then by name
  sortedGroups.forEach(([, group]) => {
    group.projects.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1
      return a.name.localeCompare(b.name)
    })
  })

  return sortedGroups
}
