'use client'

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'
import { useArchivedProjects } from '@/components/providers/ProjectProvider'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import {
  COLLAPSED_ORGS_KEY,
  type GroupedProjects,
} from './ProjectSelector.types'
import { useProjectActions } from './useProjectActions'

export function useProjectSelector() {
  const { isArchived } = useArchivedProjects()
  const { selectedOrgSlug, organizations } = useOrganization()
  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [manualPath, setManualPath] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [collapsedOrgs, setCollapsedOrgs] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const s = localStorage.getItem(COLLAPSED_ORGS_KEY)
      return s ? new Set(JSON.parse(s)) : new Set()
    } catch {
      return new Set()
    }
  })
  const searchInputRef = useRef<HTMLInputElement>(null)

  const actions = useProjectActions({
    projects,
    setProjects,
    setIsOpen,
    setSearchQuery,
    setManualPath,
    manualPath,
  })

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const req = create(ListProjectsRequestSchema, {
        includeStale: false,
        organizationSlug:
          selectedOrgSlug !== null && selectedOrgSlug !== ''
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
  }, [selectedOrgSlug])

  useEffect(() => {
    if (isOpen) fetchProjects()
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const groupedProjects: GroupedProjects = useMemo(() => {
    if (selectedOrgSlug !== null) return null
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
  }, [visibleProjects, selectedOrgSlug, organizations])

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
