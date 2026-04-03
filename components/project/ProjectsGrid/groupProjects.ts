import type { GroupedProject } from './GroupedProject'
import type { ProjectInfo, Organization } from '@/gen/centy_pb'

/**
 * Group projects by organization slug, sort groups and projects within each group
 */
export function groupProjects(
  projects: ProjectInfo[],
  organizations: Organization[]
): GroupedProject[] {
  const groups = new Map<string, { name: string; projects: ProjectInfo[] }>()

  groups.set('', { name: 'Ungrouped', projects: [] })

  for (const project of projects) {
    const orgSlug = project.organizationSlug || ''
    let group = groups.get(orgSlug)
    if (!group) {
      const org = organizations.find(o => o.slug === orgSlug)
      group = { name: (org ? org.name : '') || orgSlug, projects: [] }
      groups.set(orgSlug, group)
    }
    group.projects.push(project)
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
