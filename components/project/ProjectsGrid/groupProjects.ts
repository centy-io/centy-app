import type { ProjectInfo, Organization } from '@/gen/centy_pb'

export type GroupedProject = [string, { name: string; projects: ProjectInfo[] }]

/**
 * Group projects by organization slug, sort groups and projects within each group
 */
export function groupProjects(
  projects: ProjectInfo[],
  organizations: Organization[]
): GroupedProject[] {
  const groups: Map<string, { name: string; projects: ProjectInfo[] }> =
    new Map()

  groups.set('', { name: 'Ungrouped', projects: [] })

  for (const project of projects) {
    const orgSlug = project.organizationSlug || ''
    if (!groups.has(orgSlug)) {
      const org = organizations.find(o => o.slug === orgSlug)
      groups.set(orgSlug, {
        name: (org ? org.name : '') || orgSlug,
        projects: [],
      })
    }
    groups.get(orgSlug)!.projects.push(project)
  }

  const sortedGroups = Array.from(groups.entries())
    .filter(([, g]) => g.projects.length > 0)
    .sort(([slugA], [slugB]) => {
      if (slugA === '' && slugB !== '') return 1
      if (slugA !== '' && slugB === '') return -1
      return slugA.localeCompare(slugB)
    })

  sortedGroups.forEach(([, group]) => {
    group.projects.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1
      return a.name.localeCompare(b.name)
    })
  })

  return sortedGroups
}
