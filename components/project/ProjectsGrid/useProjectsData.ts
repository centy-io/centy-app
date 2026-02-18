'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  ListOrganizationsRequestSchema,
  SetProjectFavoriteRequestSchema,
  type ProjectInfo,
  type Organization,
} from '@/gen/centy_pb'
import { type GroupedProject, groupProjects } from './groupProjects'

export function useProjectsData() {
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
          create(ListProjectsRequestSchema, {
            includeStale: false,
          })
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

  const groupedProjects: GroupedProject[] = useMemo(
    () => groupProjects(projects, organizations),
    [projects, organizations]
  )

  return {
    projects,
    loading,
    error,
    fetchData,
    handleToggleFavorite,
    groupedProjects,
  }
}
