import { useMemo } from 'react'
import type { ProjectInfo, Organization } from '@/gen/centy_pb'
import type { GroupedProjectEntry } from './ProjectSelector.types'

export function useProjectFiltering(
  projects: ProjectInfo[],
  isArchived: (path: string) => boolean,
  searchQuery: string,
  selectedOrgSlug: string | null,
  organizations: Organization[]
) {
  const visibleProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return projects
      .filter(p => !isArchived(p.path))
      .filter(
        p =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.path.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1
        if (!a.isFavorite && b.isFavorite) return 1
        return 0
      })
  }, [projects, isArchived, searchQuery])

  const groupedProjects = useMemo(() => {
    if (selectedOrgSlug !== null) return null
    const groups = new Map<string, GroupedProjectEntry>()
    groups.set('', { name: 'Ungrouped', projects: [] })
    for (const p of visibleProjects) {
      const s = p.organizationSlug || ''
      if (!groups.has(s)) {
        const org = organizations.find(o => o.slug === s)
        groups.set(s, { name: org?.name || s, projects: [] })
      }
      groups.get(s)!.projects.push(p)
    }
    return Array.from(groups.entries())
      .filter(([, g]) => g.projects.length > 0)
      .sort(([a], [b]) => {
        if (a === '' && b !== '') return 1
        if (a !== '' && b === '') return -1
        return a.localeCompare(b)
      })
  }, [visibleProjects, selectedOrgSlug, organizations])

  return { visibleProjects, groupedProjects }
}
