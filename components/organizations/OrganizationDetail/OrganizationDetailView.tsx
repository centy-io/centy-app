'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import { OrganizationReadView } from './OrganizationReadView'
import { OrgEditForm } from './OrgEditForm'
import { OrgDeleteConfirm } from './OrgDeleteConfirm'
import { OrgActionsBar } from './OrgActionsBar'
import type { OrganizationDetailViewProps } from './OrganizationDetailViewProps'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function OrganizationDetailView(
  props: OrganizationDetailViewProps
): React.JSX.Element {
  const {
    organization,
    projects,
    error,
    isEditing,
    editName,
    editDescription,
    editSlug,
    saving,
    deleting,
    showDeleteConfirm,
    deleteError,
    setIsEditing,
    setEditName,
    setEditDescription,
    setEditSlug,
    setShowDeleteConfirm,
    setDeleteError,
    handleSave,
    handleDelete,
    handleCancelEdit,
  } = props

  return (
    <div className="organization-detail">
      <div className="organization-header">
        <Link
          href={route({ pathname: '/organizations' })}
          className="back-link"
        >
          Back to Organizations
        </Link>
        <div className="organization-actions">
          <OrgActionsBar
            isEditing={isEditing}
            saving={saving}
            editName={editName}
            setIsEditing={setIsEditing}
            setShowDeleteConfirm={setShowDeleteConfirm}
            handleSave={handleSave}
            handleCancelEdit={handleCancelEdit}
          />
        </div>
      </div>
      {error && <DaemonErrorMessage error={error} />}
      {showDeleteConfirm && (
        <OrgDeleteConfirm
          projects={projects}
          deleting={deleting}
          deleteError={deleteError}
          handleDelete={handleDelete}
          setShowDeleteConfirm={setShowDeleteConfirm}
          setDeleteError={setDeleteError}
        />
      )}
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
          <OrganizationReadView
            organization={organization}
            projects={projects}
          />
        )}
      </div>
    </div>
  )
}
