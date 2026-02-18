'use client'

import type { ProjectInfo } from '@/gen/centy_pb'

interface ProjectCardProps {
  project: ProjectInfo
  onClick: () => void
  onToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
}

export function ProjectCard({
  project,
  onClick,
  onToggleFavorite,
}: ProjectCardProps) {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-header">
        <h3 className="project-name">{project.name}</h3>
        <button
          className={`favorite-btn ${project.isFavorite ? 'active' : ''}`}
          onClick={e => onToggleFavorite(e, project)}
          title={
            project.isFavorite ? 'Remove from favorites' : 'Add to favorites'
          }
        >
          {project.isFavorite ? '\u2605' : '\u2606'}
        </button>
      </div>

      {!project.initialized && (
        <div className="project-badge not-initialized">Not initialized</div>
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
  )
}
