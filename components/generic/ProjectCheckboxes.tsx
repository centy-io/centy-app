import { useEffect, useState } from 'react'
import { create } from '@bufbuild/protobuf'
import type { ProjectInfo } from '@/gen/centy_pb'
import { ListProjectsRequestSchema } from '@/gen/centy_pb'
import { centyClient } from '@/lib/grpc/client'

interface ProjectCheckboxesProps {
  currentProjectPath: string
  selectedProjects: string[]
  onToggle: (path: string) => void
}

export function useOtherProjects(currentProjectPath: string) {
  const [projects, setProjects] = useState<ProjectInfo[]>([])

  useEffect(() => {
    async function load() {
      try {
        const response = await centyClient.listProjects(
          create(ListProjectsRequestSchema, {
            includeStale: false,
            includeUninitialized: false,
            includeArchived: false,
          })
        )
        setProjects(
          response.projects.filter(p => p.path !== currentProjectPath)
        )
      } catch {
        // silently ignore — multi-project selection is optional
      }
    }
    void load()
  }, [currentProjectPath])

  return projects
}

export function ProjectCheckboxes({
  currentProjectPath,
  selectedProjects,
  onToggle,
}: ProjectCheckboxesProps) {
  const projects = useOtherProjects(currentProjectPath)

  if (projects.length === 0) return null

  return (
    <div className="form-group">
      <label className="form-label">Also add to projects:</label>
      <div className="project-checkboxes">
        {projects.map(project => (
          <label key={project.path} className="project-checkbox-label">
            <input
              className="project-checkbox-input"
              type="checkbox"
              checked={selectedProjects.includes(project.path)}
              onChange={() => {
                onToggle(project.path)
              }}
            />
            {project.userTitle || project.projectTitle || project.name}
          </label>
        ))}
      </div>
    </div>
  )
}
