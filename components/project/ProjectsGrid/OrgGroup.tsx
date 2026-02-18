'use client'

import { ProjectCard } from './ProjectCard'
import type { ProjectInfo } from '@/gen/centy_pb'

interface OrgGroupProps {
  orgSlug: string
  groupName: string
  projects: ProjectInfo[]
  onProjectClick: (project: ProjectInfo) => void
  onToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
}

export function OrgGroup({
  orgSlug,
  groupName,
  projects,
  onProjectClick,
  onToggleFavorite,
}: OrgGroupProps) {
  return (
    <div className="project-org-group">
      <div className="org-group-header">
        <h2>
          {orgSlug ? (
            <>
              <span className="org-icon">{'\uD83C\uDFE2'}</span>
              {groupName}
            </>
          ) : (
            <>
              <span className="org-icon">{'\uD83D\uDCC1'}</span>
              {groupName}
            </>
          )}
        </h2>
        <span className="org-project-count">{projects.length}</span>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard
            key={project.path}
            project={project}
            onClick={() => onProjectClick(project)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  )
}
