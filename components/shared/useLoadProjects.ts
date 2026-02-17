import { useState, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'

export function useLoadProjects(
  currentProjectPath: string,
  excludeCurrent: boolean = false
) {
  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [selectedProject, setSelectedProject] = useState<string>(
    excludeCurrent ? '' : currentProjectPath
  )
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [projectError, setProjectError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProjects() {
      try {
        const request = create(ListProjectsRequestSchema, {
          includeStale: false,
          includeUninitialized: false,
          includeArchived: false,
        })
        const response = await centyClient.listProjects(request)
        const filtered = excludeCurrent
          ? response.projects.filter(p => p.path !== currentProjectPath)
          : response.projects
        setProjects(filtered)
        if (filtered.length > 0) {
          setSelectedProject(
            excludeCurrent ? filtered[0].path : currentProjectPath
          )
        }
      } catch (err) {
        console.error('Failed to load projects:', err)
        setProjectError('Failed to load projects')
      } finally {
        setLoadingProjects(false)
      }
    }
    loadProjects()
  }, [currentProjectPath, excludeCurrent])

  return {
    projects,
    selectedProject,
    setSelectedProject,
    loadingProjects,
    projectError,
  }
}
