'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  ListOrganizationsRequestSchema,
  SetProjectFavoriteRequestSchema,
  type ProjectInfo,
  type Organization,
} from '@/gen/centy_pb'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'
import type { ProjectsGridData } from './types'
import { groupProjects } from './groupProjects'

export function useProjectsGrid(): ProjectsGridData {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [projectsResponse, orgsResponse] = await Promise.all([
        centyClient.listProjects(
          create(ListProjectsRequestSchema, { includeStale: false })
        ),
        centyClient.listOrganizations(
          create(ListOrganizationsRequestSchema, {})
        ),
      ])

      setProjects(projectsResponse.projects)
      setOrganizations(orgsResponse.organizations)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleToggleFavorite = async (
    e: React.MouseEvent,
    project: ProjectInfo
  ) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const request = create(SetProjectFavoriteRequestSchema, {
        projectPath: project.path,
        isFavorite: !project.isFavorite,
      })
      const response = await centyClient.setProjectFavorite(request)
      if (response.success && response.project) {
        setProjects(prev =>
          prev.map(p => (p.path === project.path ? response.project! : p))
        )
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    }
  }

  const handleProjectClick = (project: ProjectInfo) => {
    const orgSlug = project.organizationSlug || UNGROUPED_ORG_MARKER
    router.push(
      route({
        pathname: '/[organization]/[project]/issues',
        query: { organization: orgSlug, project: project.name },
      })
    )
  }

  const groupedProjects = useMemo(
    () => groupProjects(projects, organizations),
    [projects, organizations]
  )

  return {
    projects,
    organizations,
    loading,
    error,
    fetchData,
    handleToggleFavorite,
    handleProjectClick,
    groupedProjects,
  }
}
