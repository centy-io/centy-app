/* eslint-disable max-lines */
'use client'

import Link from 'next/link'
import { OrganizationReadView } from './OrganizationReadView'
import type { Organization, ProjectInfo } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface OrganizationDetailViewProps {
  organization: Organization
  projects: ProjectInfo[]
  error: string | null
  isEditing: boolean
  editName: string
  editDescription: string
  editSlug: string
  saving: boolean
  deleting: boolean
  showDeleteConfirm: boolean
  deleteError: string | null
  setIsEditing: (v: boolean) => void
  setEditName: (v: string) => void
  setEditDescription: (v: string) => void
  setEditSlug: (v: string) => void
  setShowDeleteConfirm: (v: boolean) => void
  setDeleteError: (v: string | null) => void
  handleSave: () => Promise<void>
  handleDelete: () => Promise<void>
  handleCancelEdit: () => void
}

// eslint-disable-next-line max-lines-per-function
export function OrganizationDetailView(props: OrganizationDetailViewProps) {
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
        <Link href="/organizations" className="back-link">
          Back to Organizations
        </Link>
        <div className="organization-actions">
          {!isEditing ? (
            <>
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="delete-btn"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button onClick={handleCancelEdit} className="cancel-btn">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editName.trim()}
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
          <p className="delete-confirm-message">
            Are you sure you want to delete this organization?
          </p>
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
                setShowDeleteConfirm(false)
                setDeleteError(null)
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
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
          <code className="org-slug-code">{organization.slug}</code>
        </div>
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-name">
                Name:
              </label>
              <input
                className="form-input"
                id="edit-name"
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Organization name"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-slug">
                Slug:
              </label>
              <input
                className="form-input"
                id="edit-slug"
                type="text"
                value={editSlug}
                onChange={e => setEditSlug(e.target.value)}
                placeholder="organization-slug"
              />
              {editSlug !== organization.slug && (
                <p className="field-hint warning">
                  Changing the slug will update the URL. Make sure to update any
                  references.
                </p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-description">
                Description:
              </label>
              <textarea
                className="form-textarea"
                id="edit-description"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={3}
              />
            </div>
          </div>
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
