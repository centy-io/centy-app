'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { useProjectsData } from './useProjectsData'
import { ProjectsGridContent } from './ProjectsGridContent'
import type { ProjectInfo } from '@/gen/centy_pb'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

export function ProjectsGrid() {
  const router = useRouter()
  const {
    projects,
    loading,
    error,
    fetchData,
    handleToggleFavorite,
    groupedProjects,
  } = useProjectsData()

  const handleProjectClick = (project: ProjectInfo) => {
    const orgSlug = project.organizationSlug || UNGROUPED_ORG_MARKER
    router.push(
      route({
        pathname: '/[organization]/[project]/issues',
        query: {
          organization: orgSlug,
          project: project.name,
        },
      })
    )
  }

  if (loading) {
    return (
      <div className="projects-grid-loading">
        <p className="projects-grid-loading-text">Loading projects...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="projects-grid-error">
        <p className="projects-grid-error-text">Error: {error}</p>
        <button onClick={() => void fetchData()} className="retry-btn">
          Retry
        </button>
      </div>
    )
  }

  if (projects.length === 0) {
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
  }

  return (
    <ProjectsGridContent
      fetchData={() => void fetchData()}
      groupedProjects={groupedProjects}
      onProjectClick={handleProjectClick}
      onToggleFavorite={(e, project) => void handleToggleFavorite(e, project)}
    />
  )
}
