'use client'

import { ProjectItem } from './ProjectItem'
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>('[role="option"]')
    )
    const activeEl = document.activeElement
    const idx = activeEl instanceof HTMLElement ? items.indexOf(activeEl) : -1
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = items[idx === -1 ? 0 : Math.min(idx + 1, items.length - 1)]
      if (next) next.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (idx <= 0) {
        onFocusSearch()
      } else {
        const prev = items[idx - 1]
        if (prev) prev.focus()
      }
    }
  }

  return (
    <ul className="project-list" role="listbox" onKeyDown={handleKeyDown}>
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
