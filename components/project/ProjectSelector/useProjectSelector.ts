'use client'

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { projectSelectorHelpers } from './projectSelectorHelpers'
import { useProjectActions } from './useProjectActions'
import type { GroupedProjects } from './ProjectSelector.types'
import type { ProjectInfo } from '@/gen/centy_pb'
import { useArchivedProjects } from '@/components/providers/ProjectProvider'
import { useOrganization } from '@/components/providers/OrganizationProvider'

const {
  fetchProjectList,
  loadCollapsedOrgs,
  saveCollapsedOrgs,
  filterAndSortProjects,
  buildGroupedProjects,
} = projectSelectorHelpers

export function useProjectSelector() {
  const { isArchived } = useArchivedProjects()
  const { selectedOrgSlug, organizations } = useOrganization()
  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [manualPath, setManualPath] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [collapsedOrgs, setCollapsedOrgs] =
    useState<Set<string>>(loadCollapsedOrgs)
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
      setProjects(await fetchProjectList(selectedOrgSlug))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [selectedOrgSlug])

  useEffect(() => {
    if (isOpen) fetchProjects()
  }, [isOpen])

  const toggleOrgCollapse = (orgSlug: string): void => {
    setCollapsedOrgs(prev => {
      const next = new Set(prev)
      if (next.has(orgSlug)) next.delete(orgSlug)
      else next.add(orgSlug)
      saveCollapsedOrgs(next)
      return next
    })
  }

  const visibleProjects = useMemo(
    () => filterAndSortProjects(projects, isArchived, searchQuery),
    [projects, isArchived, searchQuery]
  )

  const groupedProjects: GroupedProjects = useMemo(
    () => buildGroupedProjects(visibleProjects, selectedOrgSlug, organizations),
    [visibleProjects, selectedOrgSlug, organizations]
  )

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
