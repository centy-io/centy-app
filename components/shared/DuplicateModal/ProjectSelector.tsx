import type { ProjectInfo } from '@/gen/centy_pb'

interface ProjectSelectorProps {
  projects: ProjectInfo[]
  selectedProject: string
  setSelectedProject: (value: string) => void
  loadingProjects: boolean
  currentProjectPath: string
}

export function ProjectSelector({
  projects,
  selectedProject,
  setSelectedProject,
  loadingProjects,
  currentProjectPath,
}: ProjectSelectorProps) {
  return (
    <div className="move-modal-field">
      <label>Target Project</label>
      {loadingProjects ? (
        <div className="move-modal-loading">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="move-modal-empty">No projects available</div>
      ) : (
        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          className="move-modal-select"
        >
          {projects.map(project => (
            <option key={project.path} value={project.path}>
              {project.userTitle || project.projectTitle || project.name}
              {project.path === currentProjectPath ? ' (current)' : ''} (
              {project.displayPath})
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
