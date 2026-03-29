'use client'

import { OrgDeleteConfirm } from './OrgDeleteConfirm'
import { OrgDetailContent } from './OrgDetailContent'
import { OrgDetailHeader } from './OrgDetailHeader'
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
        <OrgDeleteConfirm
          projects={projects}
          deleting={deleting}
          deleteError={deleteError}
          handleDelete={handleDelete}
          setShowDeleteConfirm={setShowDeleteConfirm}
          setDeleteError={setDeleteError}
        />
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
