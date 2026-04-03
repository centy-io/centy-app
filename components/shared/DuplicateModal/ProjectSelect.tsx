'use client'

import type { ProjectInfo } from '@/gen/centy_pb'

interface ProjectSelectProps {
  projects: ProjectInfo[]
  selectedProject: string
  currentProjectPath: string
  loadingProjects: boolean
  setSelectedProject: (path: string) => void
}

export function ProjectSelect({
  projects,
  selectedProject,
  currentProjectPath,
  loadingProjects,
  setSelectedProject,
}: ProjectSelectProps) {
  if (loadingProjects) {
    return <div className="move-modal-loading">Loading projects...</div>
  }
  if (projects.length === 0) {
    return <div className="move-modal-empty">No projects available</div>
  }
  return (
    <select
      value={selectedProject}
      onChange={e => setSelectedProject(e.target.value)}
      className="move-modal-select"
    >
      {projects.map(project => (
        <option
          className="move-modal-option"
          key={project.path}
          value={project.path}
        >
          {project.userTitle || project.projectTitle || project.name}
          {project.path === currentProjectPath ? ' (current)' : ''} (
          {project.displayPath})
        </option>
      ))}
    </select>
  )
}
