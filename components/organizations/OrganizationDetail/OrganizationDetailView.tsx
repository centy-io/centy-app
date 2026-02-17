'use client'

import Link from 'next/link'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { OrgReadView } from './OrgReadView'
import { OrgEditForm } from './OrgEditForm'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import type { OrganizationDetailViewProps } from './OrganizationDetailView.types'

export function OrganizationDetailView(props: OrganizationDetailViewProps) {
  const { organization, projects, error, isEditing, saving, deleting } = props
  return (
    <div className="organization-detail">
      <div className="organization-header">
        <Link href="/organizations" className="back-link">
          Back to Organizations
        </Link>
        <div className="organization-actions">
          {!isEditing ? (
            <>
              <button
                onClick={() => props.setIsEditing(true)}
                className="edit-btn"
              >
                Edit
              </button>
              <button
                onClick={() => props.setShowDeleteConfirm(true)}
                className="delete-btn"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button onClick={props.handleCancelEdit} className="cancel-btn">
                Cancel
              </button>
              <button
                onClick={props.handleSave}
                disabled={saving || !props.editName.trim()}
                className="save-btn"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>
      {error && <DaemonErrorMessage error={error} />}
      {props.showDeleteConfirm && (
        <DeleteConfirmDialog
          projectCount={projects.length}
          deleteError={props.deleteError}
          deleting={deleting}
          onCancel={() => {
            props.setShowDeleteConfirm(false)
            props.setDeleteError(null)
          }}
          onConfirm={props.handleDelete}
        />
      )}
      <div className="organization-content">
        <div className="org-slug-badge">
          <code>{organization.slug}</code>
        </div>
        {isEditing ? (
          <OrgEditForm
            editName={props.editName}
            setEditName={props.setEditName}
            editSlug={props.editSlug}
            setEditSlug={props.setEditSlug}
            editDescription={props.editDescription}
            setEditDescription={props.setEditDescription}
            organization={organization}
          />
        ) : (
          <OrgReadView organization={organization} projects={projects} />
        )}
      </div>
    </div>
  )
}
