'use client'

import Link from 'next/link'
import type { Organization, ProjectInfo } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { OrgReadView } from './OrgReadView'

interface OrganizationDetailViewProps {
  organization: Organization
  projects: ProjectInfo[]
  error: string | null
  isEditing: boolean
  setIsEditing: (v: boolean) => void
  editName: string
  setEditName: (v: string) => void
  editDescription: string
  setEditDescription: (v: string) => void
  editSlug: string
  setEditSlug: (v: string) => void
  saving: boolean
  deleting: boolean
  showDeleteConfirm: boolean
  setShowDeleteConfirm: (v: boolean) => void
  deleteError: string | null
  setDeleteError: (v: string | null) => void
  handleSave: () => void
  handleDelete: () => void
  handleCancelEdit: () => void
}

export function OrganizationDetailView(props: OrganizationDetailViewProps) {
  const {
    organization,
    projects,
    error,
    isEditing,
    saving,
    deleting,
    showDeleteConfirm,
    deleteError,
  } = props
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
      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Are you sure you want to delete this organization?</p>
          {projects.length > 0 && (
            <p className="delete-warning">
              This organization has {projects.length} project(s). They will
              become ungrouped.
            </p>
          )}
          {deleteError && <p className="delete-error-message">{deleteError}</p>}
          <div className="delete-confirm-actions">
            <button
              onClick={() => {
                props.setShowDeleteConfirm(false)
                props.setDeleteError(null)
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              onClick={props.handleDelete}
              disabled={deleting}
              className="confirm-delete-btn"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      )}
      <div className="organization-content">
        <div className="org-slug-badge">
          <code>{organization.slug}</code>
        </div>
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label htmlFor="edit-name">Name:</label>
              <input
                id="edit-name"
                type="text"
                value={props.editName}
                onChange={e => props.setEditName(e.target.value)}
                placeholder="Organization name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-slug">Slug:</label>
              <input
                id="edit-slug"
                type="text"
                value={props.editSlug}
                onChange={e => props.setEditSlug(e.target.value)}
                placeholder="organization-slug"
              />
              {props.editSlug !== organization.slug && (
                <p className="field-hint warning">
                  Changing the slug will update the URL. Make sure to update any
                  references.
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="edit-description">Description:</label>
              <textarea
                id="edit-description"
                value={props.editDescription}
                onChange={e => props.setEditDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={3}
              />
            </div>
          </div>
        ) : (
          <OrgReadView organization={organization} projects={projects} />
        )}
      </div>
    </div>
  )
}
