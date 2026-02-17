'use client'

import type { ProjectInfo } from '@/gen/centy_pb'

interface ProjectOrgGroupProps {
  orgSlug: string
  group: { name: string; projects: ProjectInfo[] }
  onToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
  onProjectClick: (project: ProjectInfo) => void
}

export function ProjectOrgGroup({
  orgSlug,
  group,
  onToggleFavorite,
  onProjectClick,
}: ProjectOrgGroupProps) {
  return (
    <div className="project-org-group">
      <div className="org-group-header">
        <h2>
          <span className="org-icon">
            {orgSlug ? '\uD83C\uDFE2' : '\uD83D\uDCC1'}
          </span>
          {group.name}
        </h2>
        <span className="org-project-count">{group.projects.length}</span>
      </div>

      <div className="projects-grid">
        {group.projects.map(project => (
          <div
            key={project.path}
            className="project-card"
            onClick={() => onProjectClick(project)}
          >
            <div className="project-card-header">
              <h3 className="project-name">{project.name}</h3>
              <button
                className={`favorite-btn ${project.isFavorite ? 'active' : ''}`}
                onClick={e => onToggleFavorite(e, project)}
                title={
                  project.isFavorite
                    ? 'Remove from favorites'
                    : 'Add to favorites'
                }
              >
                {project.isFavorite ? '\u2605' : '\u2606'}
              </button>
            </div>

            {!project.initialized && (
              <div className="project-badge not-initialized">
                Not initialized
              </div>
            )}

            {project.initialized && (
              <div className="project-stats">
                <div className="project-stat">
                  <span className="stat-icon">{'\uD83D\uDCCB'}</span>
                  <span className="stat-label">Issues</span>
                  <span className="stat-value">{project.issueCount}</span>
                </div>
                <div className="project-stat">
                  <span className="stat-icon">{'\uD83D\uDCC4'}</span>
                  <span className="stat-label">Docs</span>
                  <span className="stat-value">{project.docCount}</span>
                </div>
              </div>
            )}

            <div className="project-path" title={project.displayPath}>
              {project.displayPath}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
