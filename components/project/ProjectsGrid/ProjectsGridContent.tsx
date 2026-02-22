'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import { OrgGroup } from './OrgGroup'
import type { GroupedProject } from './GroupedProject'
import type { ProjectInfo } from '@/gen/centy_pb'

interface ProjectsGridContentProps {
  fetchData: () => void
  groupedProjects: GroupedProject[]
  onProjectClick: (project: ProjectInfo) => void
  onToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
}

export function ProjectsGridContent({
  fetchData,
  groupedProjects,
  onProjectClick,
  onToggleFavorite,
}: ProjectsGridContentProps) {
  return (
    <div className="projects-grid-container">
      <div className="projects-grid-header">
        <h1 className="projects-grid-title">Projects</h1>
        <div className="projects-grid-actions">
          <button onClick={fetchData} className="refresh-btn">
            Refresh
          </button>
          <Link
            href={route({ pathname: '/project/init' })}
            className="init-project-btn"
          >
            + Init Project
          </Link>
          <Link
            href={route({ pathname: '/organizations/new' })}
            className="create-org-btn"
          >
            + New Organization
          </Link>
        </div>
      </div>

      {groupedProjects.map(([orgSlug, group]) => (
        <OrgGroup
          key={orgSlug || '__ungrouped'}
          orgSlug={orgSlug}
          groupName={group.name}
          projects={group.projects}
          onProjectClick={onProjectClick}
          onToggleFavorite={onToggleFavorite}
        />
      ))}

      <div className="projects-grid-footer">
        <Link
          href={route({ pathname: '/organizations' })}
          className="view-all-link"
        >
          Manage Organizations
        </Link>
      </div>
    </div>
  )
}
