'use client'

import { OrganizationReadView } from './OrganizationReadView'
import { OrgEditForm } from './OrgEditForm'
import type { OrganizationDetailViewProps } from './OrganizationDetailViewProps'

interface OrgDetailContentProps {
  organization: OrganizationDetailViewProps['organization']
  projects: OrganizationDetailViewProps['projects']
  isEditing: boolean
  editName: string
  editDescription: string
  editSlug: string
  setEditName: OrganizationDetailViewProps['setEditName']
  setEditDescription: OrganizationDetailViewProps['setEditDescription']
  setEditSlug: OrganizationDetailViewProps['setEditSlug']
}

export function OrgDetailContent({
  organization,
  projects,
  isEditing,
  editName,
  editDescription,
  editSlug,
  setEditName,
  setEditDescription,
  setEditSlug,
}: OrgDetailContentProps): React.JSX.Element {
  return (
    <div className="organization-content">
      <div className="org-slug-badge">
        <code className="org-slug-code">{organization.slug}</code>
      </div>
      {isEditing ? (
        <OrgEditForm
          editName={editName}
          editDescription={editDescription}
          editSlug={editSlug}
          currentSlug={organization.slug}
          setEditName={setEditName}
          setEditDescription={setEditDescription}
          setEditSlug={setEditSlug}
        />
      ) : (
        <OrganizationReadView organization={organization} projects={projects} />
      )}
    </div>
  )
}
