'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import type { ProjectInfo } from '@/gen/centy_pb'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'
import { useProjectsData } from './useProjectsData'
import { OrgGroup } from './OrgGroup'

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
        <p>Loading projects...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="projects-grid-error">
        <p>Error: {error}</p>
        <button onClick={fetchData} className="retry-btn">
          Retry
        </button>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="projects-grid-empty">
        <h2>No projects found</h2>
        <p>
          <Link href="/project/init">Initialize a project</Link> with Centy to
          see it here, or{' '}
          <Link href="/organizations/new">create an organization</Link> to get
          started.
        </p>
      </div>
    )
  }

  return (
    <div className="projects-grid-container">
      <div className="projects-grid-header">
        <h1>Projects</h1>
        <div className="projects-grid-actions">
          <button onClick={fetchData} className="refresh-btn">
            Refresh
          </button>
          <Link href="/project/init" className="init-project-btn">
            + Init Project
          </Link>
          <Link href="/organizations/new" className="create-org-btn">
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
          onProjectClick={handleProjectClick}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}

      <div className="projects-grid-footer">
        <Link href="/organizations" className="view-all-link">
          Manage Organizations
        </Link>
      </div>
    </div>
  )
}
