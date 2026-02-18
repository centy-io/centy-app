'use client'

import type { ProjectInfo } from '@/gen/centy_pb'
import { ProjectItem } from './ProjectItem'

interface ProjectFlatListProps {
  projects: ProjectInfo[]
  projectPath: string
  onSelect: (project: ProjectInfo) => void
  onToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
  onArchive: (e: React.MouseEvent, project: ProjectInfo) => void
}

export function ProjectFlatList({
  projects,
  projectPath,
  onSelect,
  onToggleFavorite,
  onArchive,
}: ProjectFlatListProps) {
  return (
    <ul className="project-list" role="listbox">
      {projects.map(project => (
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
  )
}
