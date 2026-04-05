import { useOtherProjects } from './ProjectCheckboxes'

interface EditProjectsFieldProps {
  projectPath: string
  editProjects: string[]
  setEditProjects: (v: string[]) => void
}

export function EditProjectsField({
  projectPath,
  editProjects,
  setEditProjects,
}: EditProjectsFieldProps): React.JSX.Element | null {
  const otherProjects = useOtherProjects(projectPath)

  if (otherProjects.length === 0) return null

  return (
    <div className="form-group">
      <label className="form-label">Projects:</label>
      <div className="project-checkboxes">
        <label className="project-checkbox-label">
          <input
            className="project-checkbox-input"
            type="checkbox"
            checked={true}
            disabled={true}
          />
          {projectPath.split('/').pop()}
        </label>
        {otherProjects.map(project => (
          <label key={project.path} className="project-checkbox-label">
            <input
              className="project-checkbox-input"
              type="checkbox"
              checked={editProjects.includes(project.path)}
              onChange={() => {
                setEditProjects(
                  editProjects.includes(project.path)
                    ? editProjects.filter(p => p !== project.path)
                    : [...editProjects, project.path]
                )
              }}
            />
            {project.userTitle || project.projectTitle || project.name}
          </label>
        ))}
      </div>
    </div>
  )
}
