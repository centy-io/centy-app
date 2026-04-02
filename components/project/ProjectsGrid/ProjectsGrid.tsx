'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { useProjectsData } from './useProjectsData'
import { OrgGroup } from './OrgGroup'
import type { ProjectInfo } from '@/gen/centy_pb'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

// eslint-disable-next-line max-lines-per-function
export function ProjectsGrid() {
  const router = useRouter()
  const data = useProjectsData()

  const handleProjectClick = (project: ProjectInfo) => {
    router.push(
      route({
        pathname: '/[organization]/[project]/issues',
        query: {
          organization: project.organizationSlug || UNGROUPED_ORG_MARKER,
          project: project.name,
        },
      })
    )
  }

  if (data.loading)
    return (
      <div className="projects-grid-loading">
        <p className="projects-grid-loading-text">Loading projects...</p>
      </div>
    )

  if (data.error)
    return (
      <div className="projects-grid-error">
        <p className="projects-grid-error-text">Error: {data.error}</p>
        <button onClick={data.fetchData} className="retry-btn">
          Retry
        </button>
      </div>
    )

  if (data.projects.length === 0)
    return (
      <div className="projects-grid-empty">
        <h2 className="projects-grid-empty-title">No projects found</h2>
        <p className="projects-grid-empty-description">
          <Link href={route({ pathname: '/project/init' })}>
            Initialize a project
          </Link>{' '}
          with Centy to see it here, or{' '}
          <Link href={route({ pathname: '/organizations/new' })}>
            create an organization
          </Link>{' '}
          to get started.
        </p>
      </div>
    )

  return (
    <div className="projects-grid-container">
      <div className="projects-grid-header">
        <h1 className="projects-grid-title">Projects</h1>
        <div className="projects-grid-actions">
          <button onClick={data.fetchData} className="refresh-btn">
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

      {data.groupedProjects.map(([orgSlug, group]) => (
        <OrgGroup
          key={orgSlug || '__ungrouped'}
          orgSlug={orgSlug}
          groupName={group.name}
          projects={group.projects}
          onProjectClick={handleProjectClick}
          onToggleFavorite={data.handleToggleFavorite}
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
