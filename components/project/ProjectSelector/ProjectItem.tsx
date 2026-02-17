'use client'

import type { ProjectInfo } from '@/gen/centy_pb'

interface ProjectItemProps {
  project: ProjectInfo
  isSelected: boolean
  onSelect: (project: ProjectInfo) => void
  onArchive: (e: React.MouseEvent, project: ProjectInfo) => void
  onToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
}

export function ProjectItem({
  project,
  isSelected,
  onSelect,
  onArchive,
  onToggleFavorite,
}: ProjectItemProps) {
  return (
    <li
      role="option"
      aria-selected={isSelected}
      className={`project-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(project)}
    >
      <div className="project-item-main">
        <button
          className={`favorite-btn ${project.isFavorite ? 'active' : ''}`}
          onClick={e => onToggleFavorite(e, project)}
          title={
            project.isFavorite ? 'Remove from favorites' : 'Add to favorites'
          }
        >
          {project.isFavorite ? '\u2605' : '\u2606'}
        </button>
        <span className="project-item-name">{project.name}</span>
        {!project.initialized && (
          <span className="project-badge not-initialized">Not initialized</span>
        )}
        <button
          className="archive-btn"
          onClick={e => onArchive(e, project)}
          title="Archive project"
        >
          Archive
        </button>
      </div>
      <div className="project-item-details">
        <span className="project-item-path" title={project.displayPath}>
          {project.displayPath}
        </span>
        <div className="project-item-stats">
          {project.initialized && (
            <>
              <span title="Issues">
                {'\uD83D\uDCCB'} {project.issueCount}
              </span>
              <span title="Docs">
                {'\uD83D\uDCC4'} {project.docCount}
              </span>
            </>
          )}
        </div>
      </div>
    </li>
  )
}
