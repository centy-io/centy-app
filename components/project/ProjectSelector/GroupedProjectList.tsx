'use client'

import type { ProjectInfo } from '@/gen/centy_pb'
import { ProjectItem } from './ProjectItem'
import type { GroupedProjectEntry } from './ProjectSelector.types'

interface GroupedProjectListProps {
  groupedProjects: [string, GroupedProjectEntry][]
  collapsedOrgs: Set<string>
  projectPath: string
  toggleOrgCollapse: (orgSlug: string) => void
  handleSelectProject: (project: ProjectInfo) => void
  handleArchiveProject: (e: React.MouseEvent, project: ProjectInfo) => void
  handleToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
}

export function GroupedProjectList(props: GroupedProjectListProps) {
  const { groupedProjects, collapsedOrgs, projectPath } = props
  return (
    <div className="project-list-grouped" role="listbox">
      {groupedProjects.map(([orgSlug, group]) => {
        const isCollapsed = collapsedOrgs.has(orgSlug)
        return (
          <div key={orgSlug || '__ungrouped'} className="project-group">
            <button
              className="project-group-header"
              onClick={() => props.toggleOrgCollapse(orgSlug)}
              aria-expanded={!isCollapsed}
            >
              <span
                className={`project-group-chevron ${isCollapsed ? 'collapsed' : ''}`}
              >
                {'\u25BC'}
              </span>
              <span className="project-group-name">
                {orgSlug
                  ? `\uD83C\uDFE2 ${group.name}`
                  : '\uD83D\uDCC1 Ungrouped'}
              </span>
              <span className="project-group-count">
                {group.projects.length}
              </span>
            </button>
            {!isCollapsed && (
              <ul className="project-group-list">
                {group.projects.map(project => (
                  <ProjectItem
                    key={project.path}
                    project={project}
                    isSelected={project.path === projectPath}
                    onSelect={props.handleSelectProject}
                    onArchive={props.handleArchiveProject}
                    onToggleFavorite={props.handleToggleFavorite}
                  />
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
