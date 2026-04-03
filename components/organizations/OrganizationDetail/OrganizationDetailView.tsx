'use client'

import { OrgDetailContent } from './OrgDetailContent'
import { OrgDetailHeader } from './OrgDetailHeader'
import type { OrganizationDetailViewProps } from './OrganizationDetailViewProps'
import { DeleteConfirm } from '@/components/shared/DeleteConfirm'
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
      <OrgDetailHeader
        isEditing={isEditing}
        saving={saving}
        editName={editName}
        setIsEditing={setIsEditing}
        setShowDeleteConfirm={setShowDeleteConfirm}
        handleSave={handleSave}
        handleCancelEdit={handleCancelEdit}
      />
      {error && <DaemonErrorMessage error={error} />}
      {showDeleteConfirm && (
        <DeleteConfirm
          message="Are you sure you want to delete this organization?"
          deleting={deleting}
          onCancel={() => {
            setShowDeleteConfirm(false)
            setDeleteError(null)
          }}
          onConfirm={() => void handleDelete()}
          error={deleteError}
        >
          {projects.length > 0 && (
            <p className="delete-warning">
              This organization has {projects.length} project(s). They will
              become ungrouped.
            </p>
          )}
        </DeleteConfirm>
      )}
      <OrgDetailContent
        organization={organization}
        projects={projects}
        isEditing={isEditing}
        editName={editName}
        editDescription={editDescription}
        editSlug={editSlug}
        setEditName={setEditName}
        setEditDescription={setEditDescription}
        setEditSlug={setEditSlug}
      />
    </div>
  )
}
