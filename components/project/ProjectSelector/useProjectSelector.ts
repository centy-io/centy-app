'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'
import { useArchivedProjects } from '@/components/providers/ProjectProvider'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import { COLLAPSED_ORGS_KEY } from './ProjectSelector.types'
import { getCurrentPage, persistCollapsedOrgs } from './projectSelectorActions'
import { useProjectActions } from './useProjectActions'

export function useProjectSelector() {
  const params = useParams()
  const pathname = usePathname()
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
      return new Set(
        JSON.parse(localStorage.getItem(COLLAPSED_ORGS_KEY) || '[]')
      )
    } catch {
      return new Set()
    }
  })
  const searchInputRef = useRef<HTMLInputElement>(null)

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
  }, [isOpen])

  const actions = useProjectActions(
    projects,
    setProjects,
    () => getCurrentPage(params ?? null, pathname),
    setIsOpen,
    setSearchQuery,
    manualPath,
    setManualPath
  )

  const toggleOrgCollapse = (slug: string) => {
    setCollapsedOrgs(prev => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      persistCollapsedOrgs(next)
      return next
    })
  }

  return {
    ...actions,
    projects,
    loading,
    error,
    isOpen,
    setIsOpen,
    manualPath,
    setManualPath,
    searchQuery,
    setSearchQuery,
    collapsedOrgs,
    searchInputRef,
    selectedOrgSlug,
    organizations,
    isArchived,
    fetchProjects,
    toggleOrgCollapse,
  }
}
