'use client'

import type { Organization, ProjectInfo } from '@/gen/centy_pb'

interface OrganizationReadViewProps {
  organization: Organization
  projects: ProjectInfo[]
}

export function OrganizationReadView({
  organization,
  projects,
}: OrganizationReadViewProps) {
  return (
    <>
      <h1 className="organization-name">{organization.name}</h1>
      <div className="organization-metadata">
        {organization.description && (
          <div className="metadata-row">
            <span className="metadata-label">Description:</span>
            <span className="metadata-value">{organization.description}</span>
          </div>
        )}
        <div className="metadata-row">
          <span className="metadata-label">Projects:</span>
          <span className="metadata-value">{organization.projectCount}</span>
        </div>
        <div className="metadata-row">
          <span className="metadata-label">Created:</span>
          <span className="metadata-value">
            {organization.createdAt
              ? new Date(organization.createdAt).toLocaleString()
              : '-'}
          </span>
        </div>
        {organization.updatedAt && (
          <div className="metadata-row">
            <span className="metadata-label">Updated:</span>
            <span className="metadata-value">
              {new Date(organization.updatedAt).toLocaleString()}
            </span>
          </div>
        )}
      </div>
      {projects.length > 0 && (
        <div className="organization-projects">
          <h3>Projects in this organization</h3>
          <ul className="project-list">
            {projects.map(project => (
              <li key={project.path} className="project-item">
                <span className="project-name">
                  {project.userTitle || project.projectTitle || project.name}
                </span>
                <span className="project-path" title={project.path}>
                  {project.displayPath || project.path}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
