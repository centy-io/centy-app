'use client'

import type { ProjectInfo } from '@/gen/centy_pb'
import type { GroupedProjects } from './ProjectSelector.types'
import { ProjectItem } from './ProjectItem'

interface ProjectGroupListProps {
  groupedProjects: NonNullable<GroupedProjects>
  projectPath: string
  collapsedOrgs: Set<string>
  toggleOrgCollapse: (orgSlug: string) => void
  onSelect: (project: ProjectInfo) => void
  onToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
  onArchive: (e: React.MouseEvent, project: ProjectInfo) => void
}

export function ProjectGroupList({
  groupedProjects,
  projectPath,
  collapsedOrgs,
  toggleOrgCollapse,
  onSelect,
  onToggleFavorite,
  onArchive,
}: ProjectGroupListProps) {
  return (
    <div className="project-list-grouped" role="listbox">
      {groupedProjects.map(([orgSlug, group]) => {
        const isCollapsed = collapsedOrgs.has(orgSlug)
        return (
          <div key={orgSlug || '__ungrouped'} className="project-group">
            <button
              className="project-group-header"
              onClick={() => toggleOrgCollapse(orgSlug)}
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
                  : `\uD83D\uDCC1 Ungrouped`}
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
                    onSelect={onSelect}
                    onToggleFavorite={onToggleFavorite}
                    onArchive={onArchive}
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
