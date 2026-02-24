'use client'

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import {
  COLLAPSED_ORGS_KEY,
  type GroupedProjects,
} from './ProjectSelector.types'
import { useProjectActions } from './useProjectActions'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'
import { useArchivedProjects } from '@/components/providers/ProjectProvider'
import { useOrganization } from '@/components/providers/OrganizationProvider'

function useCollapsedOrgs() {
  const [collapsedOrgs, setCollapsedOrgs] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const s = localStorage.getItem(COLLAPSED_ORGS_KEY)
      return s ? new Set(JSON.parse(s)) : new Set()
    } catch {
      return new Set()
    }
  })
  const toggleOrgCollapse = (orgSlug: string) => {
    setCollapsedOrgs(prev => {
      const next = new Set(prev)
      if (next.has(orgSlug)) next.delete(orgSlug)
      else next.add(orgSlug)
      try {
        localStorage.setItem(COLLAPSED_ORGS_KEY, JSON.stringify([...next]))
      } catch {
        /* ignore */
      }
      return next
    })
  }
  return { collapsedOrgs, toggleOrgCollapse }
}

function useFetchProjects(
  selectedOrgSlug: string | null | undefined,
  setProjects: (p: ProjectInfo[]) => void
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
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
      setProjects((await centyClient.listProjects(req)).projects)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [selectedOrgSlug, setProjects])
  return { loading, error, fetchProjects }
}

function useVisibleAndGroupedProjects(
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

export function useProjectSelector() {
  const { selectedOrgSlug } = useOrganization()
  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [manualPath, setManualPath] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { collapsedOrgs, toggleOrgCollapse } = useCollapsedOrgs()
  const { loading, error, fetchProjects } = useFetchProjects(
    selectedOrgSlug,
    setProjects
  )
  const { visibleProjects, groupedProjects } = useVisibleAndGroupedProjects(
    projects,
    searchQuery,
    selectedOrgSlug
  )
  const actions = useProjectActions({
    projects,
    setProjects,
    setIsOpen,
    setSearchQuery,
    setManualPath,
    manualPath,
  })

  useEffect(() => {
    if (isOpen) fetchProjects()
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...actions,
    loading,
    error,
    isOpen,
    manualPath,
    searchQuery,
    collapsedOrgs,
    searchInputRef,
    visibleProjects,
    groupedProjects,
    setIsOpen,
    setManualPath,
    setSearchQuery,
    fetchProjects,
    toggleOrgCollapse,
  }
}
