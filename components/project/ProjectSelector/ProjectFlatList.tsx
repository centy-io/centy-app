'use client'

import { ProjectItem } from './ProjectItem'
import { makeListKeyboardHandler } from './useListKeyboardNav'
import type { ProjectInfo } from '@/gen/centy_pb'

interface ProjectFlatListProps {
  projects: ProjectInfo[]
  projectPath: string
  onSelect: (project: ProjectInfo) => void
  onToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
  onArchive: (e: React.MouseEvent, project: ProjectInfo) => void
  onFocusSearch: () => void
}

export function ProjectFlatList({
  projects,
  projectPath,
  onSelect,
  onToggleFavorite,
  onArchive,
  onFocusSearch,
}: ProjectFlatListProps) {
  return (
    <ul
      id="project-listbox"
      className="project-list"
      role="listbox"
      aria-label="Projects"
      onKeyDown={makeListKeyboardHandler(onFocusSearch)}
    >
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
