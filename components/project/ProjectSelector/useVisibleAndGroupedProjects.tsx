'use client'

import { useMemo } from 'react'
import { type GroupedProjects } from './ProjectSelector.types'
import { type ProjectInfo } from '@/gen/centy_pb'
import { useArchivedProjects } from '@/components/providers/ProjectProvider'
import { useOrganization } from '@/components/providers/OrganizationProvider'

export function useVisibleAndGroupedProjects(
  projects: ProjectInfo[],
  searchQuery: string,
  selectedOrgSlug: string | null | undefined
) {
  const { isArchived } = useArchivedProjects()
  const { organizations } = useOrganization()
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
      .sort((a, b) =>
        a.isFavorite && !b.isFavorite
          ? -1
          : !a.isFavorite && b.isFavorite
            ? 1
            : 0
      )
  }, [projects, isArchived, searchQuery])
  const groupedProjects: GroupedProjects = useMemo(() => {
    if (selectedOrgSlug !== null && selectedOrgSlug !== undefined) return null
    const groups = new Map<string, { name: string; projects: ProjectInfo[] }>()
    groups.set('', { name: 'Ungrouped', projects: [] })
    for (const p of visibleProjects) {
      const s = p.organizationSlug || ''
      if (!groups.has(s)) {
        const o = organizations.find(o => o.slug === s)
        groups.set(s, { name: (o ? o.name : '') || s, projects: [] })
      }
      groups.get(s)!.projects.push(p)
    }
    return Array.from(groups.entries())
      .filter(([, g]) => g.projects.length > 0)
      .sort(([a], [b]) =>
        a === '' && b !== ''
          ? 1
          : a !== '' && b === ''
            ? -1
            : a.localeCompare(b)
      )
  }, [visibleProjects, selectedOrgSlug, organizations])
  return { visibleProjects, groupedProjects }
}
