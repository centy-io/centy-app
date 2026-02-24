'use client'

import { useState, useEffect, useRef } from 'react'
import { useProjectActions } from './useProjectActions'
import { useCollapsedOrgs } from './useCollapsedOrgs'
import { useFetchProjects } from './useFetchProjects'
import { useVisibleAndGroupedProjects } from './useVisibleAndGroupedProjects'
import { type ProjectInfo } from '@/gen/centy_pb'
import { useOrganization } from '@/components/providers/OrganizationProvider'

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
