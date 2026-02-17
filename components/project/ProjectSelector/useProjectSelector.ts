'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  RegisterProjectRequestSchema,
  SetProjectFavoriteRequestSchema,
  type ProjectInfo,
} from '@/gen/centy_pb'
import {
  useProject,
  useArchivedProjects,
} from '@/components/providers/ProjectProvider'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'
import { COLLAPSED_ORGS_KEY, ROOT_ROUTES } from './ProjectSelector.types'

export function useProjectSelector() {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const { projectPath, setProjectPath, setIsInitialized } = useProject()
  const { isArchived, archiveProject } = useArchivedProjects()
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
  const getCurrentPage = () => {
    const org = params?.organization as string | undefined
    const proj = params?.project as string | undefined
    const segments = pathname.split('/').filter(Boolean)
    if (org && proj) return segments[2] || 'issues'
    if (segments.length >= 2 && !ROOT_ROUTES.has(segments[0]))
      return segments[2] || 'issues'
    return segments[0] || 'issues'
  }
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isOpen) fetchProjects()
  }, [isOpen])
  const handleSelectProject = (p: ProjectInfo) => {
    setProjectPath(p.path)
    setIsInitialized(p.initialized)
    router.push(
      route({
        pathname: '/[...path]',
        query: {
          path: [
            p.organizationSlug || UNGROUPED_ORG_MARKER,
            p.name,
            getCurrentPage(),
          ],
        },
      })
    )
    setIsOpen(false)
    setSearchQuery('')
  }
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualPath.trim()) return
    const path = manualPath.trim()
    try {
      const req = create(RegisterProjectRequestSchema, { projectPath: path })
      const res = await centyClient.registerProject(req)
      if (res.success && res.project) {
        setProjectPath(path)
        setIsInitialized(res.project.initialized)
        setProjects(prev =>
          prev.some(p => p.path === path) ? prev : [...prev, res.project!]
        )
      } else {
        setProjectPath(path)
        setIsInitialized(null)
      }
    } catch {
      setProjectPath(path)
      setIsInitialized(null)
    }
    setManualPath('')
    setSearchQuery('')
    setIsOpen(false)
  }
  const getCurrentProjectName = () => {
    if (!projectPath) return 'Select Project'
    const p = projects.find(p => p.path === projectPath)
    return p?.name || projectPath.split('/').pop() || projectPath
  }
  const handleArchiveProject = (e: React.MouseEvent, p: ProjectInfo) => {
    e.stopPropagation()
    archiveProject(p.path)
    if (p.path === projectPath) {
      setProjectPath('')
      setIsInitialized(null)
    }
  }
  const handleToggleFavorite = async (e: React.MouseEvent, p: ProjectInfo) => {
    e.stopPropagation()
    try {
      const req = create(SetProjectFavoriteRequestSchema, {
        projectPath: p.path,
        isFavorite: !p.isFavorite,
      })
      const res = await centyClient.setProjectFavorite(req)
      if (res.success && res.project) {
        setProjects(prev =>
          prev.map(x => (x.path === p.path ? res.project! : x))
        )
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    }
  }
  const toggleOrgCollapse = (slug: string) => {
    setCollapsedOrgs(prev => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      try {
        localStorage.setItem(COLLAPSED_ORGS_KEY, JSON.stringify([...next]))
      } catch {
        /* */
      }
      return next
    })
  }
  return {
    projectPath,
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
    handleSelectProject,
    handleManualSubmit,
    getCurrentProjectName,
    handleArchiveProject,
    handleToggleFavorite,
    toggleOrgCollapse,
  }
}
