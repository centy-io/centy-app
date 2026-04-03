'use client'

import { create } from '@bufbuild/protobuf'
import {
  COLLAPSED_ORGS_KEY,
  type GroupedProjects,
} from './ProjectSelector.types'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'

async function fetchProjectList(
  selectedOrgSlug: string | null | undefined
): Promise<ProjectInfo[]> {
  const req = create(ListProjectsRequestSchema, {
    includeStale: false,
    organizationSlug:
      selectedOrgSlug !== null &&
      selectedOrgSlug !== undefined &&
      selectedOrgSlug !== ''
        ? selectedOrgSlug
        : undefined,
    ungroupedOnly: selectedOrgSlug === '',
  })
  return (await centyClient.listProjects(req)).projects
}

function loadCollapsedOrgs(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const s = localStorage.getItem(COLLAPSED_ORGS_KEY)
    return s ? new Set(JSON.parse(s)) : new Set()
  } catch {
    return new Set()
  }
}

function saveCollapsedOrgs(orgs: Set<string>): void {
  try {
    localStorage.setItem(COLLAPSED_ORGS_KEY, JSON.stringify([...orgs]))
  } catch {
    /* ignore */
  }
}

function filterAndSortProjects(
  projects: ProjectInfo[],
  isArchived: (path: string) => boolean,
  searchQuery: string
): ProjectInfo[] {
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
}

function buildGroupedProjects(
  visibleProjects: ProjectInfo[],
  selectedOrgSlug: string | null | undefined,
  organizations: { slug: string; name: string }[]
): GroupedProjects {
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
    .sort(([a], [b]) => {
      if (a === '' && b !== '') return 1
      if (a !== '' && b === '') return -1
      return a.localeCompare(b)
    })
}

export const projectSelectorHelpers = {
  fetchProjectList,
  loadCollapsedOrgs,
  saveCollapsedOrgs,
  filterAndSortProjects,
  buildGroupedProjects,
}
