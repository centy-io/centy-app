'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetOrganizationRequestSchema,
  UpdateOrganizationRequestSchema,
  DeleteOrganizationRequestSchema,
  ListProjectsRequestSchema,
  type Organization,
  type ProjectInfo,
} from '@/gen/centy_pb'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

interface OrganizationDetailProps {
  orgSlug: string
}

function OrganizationHeader({
  isEditing,
  saving,
  editName,
  onEdit,
  onDelete,
  onCancel,
  onSave,
}: {
  isEditing: boolean
  saving: boolean
  editName: string
  onEdit: () => void
  onDelete: () => void
  onCancel: () => void
  onSave: () => void
}) {
  return (
    <div className="organization-header">
      <Link href="/organizations" className="back-link">
        Back to Organizations
      </Link>

      <div className="organization-actions">
        {!isEditing ? (
          <>
            <button onClick={onEdit} className="edit-btn">
              Edit
            </button>
            <button onClick={onDelete} className="delete-btn">
              Delete
            </button>
          </>
        ) : (
          <>
            <button onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving || !editName.trim()}
              className="save-btn"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function DeleteConfirmDialog({
  projects,
  deleteError,
  deleting,
  onCancel,
  onConfirm,
}: {
  projects: ProjectInfo[]
  deleteError: string | null
  deleting: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="delete-confirm">
      <p>Are you sure you want to delete this organization?</p>
      {projects.length > 0 && (
        <p className="delete-warning">
          This organization has {projects.length} project(s). They will become
          ungrouped.
        </p>
      )}
      {deleteError && <p className="delete-error-message">{deleteError}</p>}
      <div className="delete-confirm-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="confirm-delete-btn"
        >
          {deleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  )
}

function EditForm({
  editName,
  editSlug,
  editDescription,
  organizationSlug,
  onNameChange,
  onSlugChange,
  onDescriptionChange,
}: {
  editName: string
  editSlug: string
  editDescription: string
  organizationSlug: string
  onNameChange: (value: string) => void
  onSlugChange: (value: string) => void
  onDescriptionChange: (value: string) => void
}) {
  return (
    <div className="edit-form">
      <div className="form-group">
        <label htmlFor="edit-name">Name:</label>
        <input
          id="edit-name"
          type="text"
          value={editName}
          onChange={e => onNameChange(e.target.value)}
          placeholder="Organization name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="edit-slug">Slug:</label>
        <input
          id="edit-slug"
          type="text"
          value={editSlug}
          onChange={e => onSlugChange(e.target.value)}
          placeholder="organization-slug"
        />
        {editSlug !== organizationSlug && (
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
          value={editDescription}
          onChange={e => onDescriptionChange(e.target.value)}
          placeholder="Description (optional)"
          rows={3}
        />
      </div>
    </div>
  )
}

function OrganizationMetadata({
  organization,
}: {
  organization: Organization
}) {
  return (
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
  )
}

function OrganizationProjectList({ projects }: { projects: ProjectInfo[] }) {
  if (projects.length === 0) return null

  return (
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
  )
}

function OrganizationContentView({
  organization,
  projects,
  isEditing,
  editName,
  editSlug,
  editDescription,
  onNameChange,
  onSlugChange,
  onDescriptionChange,
}: {
  organization: Organization
  projects: ProjectInfo[]
  isEditing: boolean
  editName: string
  editSlug: string
  editDescription: string
  onNameChange: (value: string) => void
  onSlugChange: (value: string) => void
  onDescriptionChange: (value: string) => void
}) {
  return (
    <div className="organization-content">
      <div className="org-slug-badge">
        <code>{organization.slug}</code>
      </div>

      {isEditing ? (
        <EditForm
          editName={editName}
          editSlug={editSlug}
          editDescription={editDescription}
          organizationSlug={organization.slug}
          onNameChange={onNameChange}
          onSlugChange={onSlugChange}
          onDescriptionChange={onDescriptionChange}
        />
      ) : (
        <>
          <h1 className="organization-name">{organization.name}</h1>
          <OrganizationMetadata organization={organization} />
          <OrganizationProjectList projects={projects} />
        </>
      )}
    </div>
  )
}

async function fetchOrganizationData(
  orgSlug: string,
  setOrganization: (org: Organization) => void,
  setEditName: (name: string) => void,
  setEditDescription: (desc: string) => void,
  setEditSlug: (slug: string) => void,
  setProjects: (projects: ProjectInfo[]) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void
) {
  if (!orgSlug) {
    setError('Missing organization slug')
    setLoading(false)
    return
  }

  setLoading(true)
  setError(null)

  try {
    const request = create(GetOrganizationRequestSchema, { slug: orgSlug })
    const response = await centyClient.getOrganization(request)

    if (!response.found || !response.organization) {
      setError('Organization not found')
      setLoading(false)
      return
    }

    const org = response.organization
    setOrganization(org)
    setEditName(org.name)
    setEditDescription(org.description || '')
    setEditSlug(org.slug)

    // Fetch projects in this organization
    const projectsRequest = create(ListProjectsRequestSchema, {
      organizationSlug: orgSlug,
    })
    const projectsResponse = await centyClient.listProjects(projectsRequest)
    setProjects(projectsResponse.projects)
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to connect to daemon'
    if (isDaemonUnimplemented(message)) {
      setError(
        'Organizations feature is not available. Please update your daemon.'
      )
    } else {
      setError(message)
    }
  } finally {
    setLoading(false)
  }
}

async function saveOrganization(
  orgSlug: string,
  editName: string,
  editDescription: string,
  editSlug: string,
  setOrganization: (org: Organization) => void,
  setIsEditing: (editing: boolean) => void,
  setError: (error: string | null) => void,
  setSaving: (saving: boolean) => void,
  router: ReturnType<typeof useRouter>
) {
  if (!orgSlug) return

  setSaving(true)
  setError(null)

  try {
    const request = create(UpdateOrganizationRequestSchema, {
      slug: orgSlug,
      name: editName,
      description: editDescription,
      newSlug: editSlug !== orgSlug ? editSlug : undefined,
    })
    const response = await centyClient.updateOrganization(request)

    if (response.success && response.organization) {
      setOrganization(response.organization)
      setIsEditing(false)
      if (response.organization.slug !== orgSlug) {
        router.push(
          route({
            pathname: '/organizations/[orgSlug]',
            query: { orgSlug: response.organization.slug },
          })
        )
      }
    } else {
      setError(response.error || 'Failed to update organization')
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to connect to daemon'
    setError(message)
  } finally {
    setSaving(false)
  }
}

async function deleteOrganizationAction(
  orgSlug: string,
  setDeleting: (deleting: boolean) => void,
  setDeleteError: (error: string | null) => void,
  router: ReturnType<typeof useRouter>
) {
  if (!orgSlug) return

  setDeleting(true)
  setDeleteError(null)

  try {
    const request = create(DeleteOrganizationRequestSchema, { slug: orgSlug })
    const response = await centyClient.deleteOrganization(request)

    if (response.success) {
      router.push('/organizations')
    } else {
      setDeleteError(response.error || 'Failed to delete organization')
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to connect to daemon'
    setDeleteError(message)
  } finally {
    setDeleting(false)
  }
}

function useOrganizationDetailFields() {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  return {
    organization,
    setOrganization,
    projects,
    setProjects,
    loading,
    setLoading,
    error,
    setError,
    isEditing,
    setIsEditing,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    editSlug,
    setEditSlug,
    saving,
    setSaving,
    deleting,
    setDeleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteError,
    setDeleteError,
  }
}

function useOrganizationDetailState(orgSlug: string) {
  const router = useRouter()
  const fields = useOrganizationDetailFields()

  const fetchOrganization = useCallback(async () => {
    await fetchOrganizationData(
      orgSlug,
      fields.setOrganization,
      fields.setEditName,
      fields.setEditDescription,
      fields.setEditSlug,
      fields.setProjects,
      fields.setError,
      fields.setLoading
    )
  }, [orgSlug]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchOrganization()
  }, [fetchOrganization])

  const handleSave = useCallback(async () => {
    await saveOrganization(
      orgSlug,
      fields.editName,
      fields.editDescription,
      fields.editSlug,
      fields.setOrganization,
      fields.setIsEditing,
      fields.setError,
      fields.setSaving,
      router
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    orgSlug,
    fields.editName,
    fields.editDescription,
    fields.editSlug,
    router,
  ])

  const handleDelete = useCallback(async () => {
    await deleteOrganizationAction(
      orgSlug,
      fields.setDeleting,
      fields.setDeleteError,
      router
    )
  }, [orgSlug, router]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancelEdit = useCallback(() => {
    fields.setIsEditing(false)
    if (!fields.organization) return
    fields.setEditName(fields.organization.name)
    fields.setEditDescription(fields.organization.description || '')
    fields.setEditSlug(fields.organization.slug)
  }, [fields.organization]) // eslint-disable-line react-hooks/exhaustive-deps

  useSaveShortcut({
    onSave: handleSave,
    enabled: fields.isEditing && !fields.saving && !!fields.editName.trim(),
  })

  return { ...fields, handleSave, handleDelete, handleCancelEdit }
}

export function OrganizationDetail({ orgSlug }: OrganizationDetailProps) {
  const state = useOrganizationDetailState(orgSlug)

  if (state.loading) {
    return (
      <div className="organization-detail">
        <div className="loading">Loading organization...</div>
      </div>
    )
  }

  if (state.error && !state.organization) {
    return (
      <div className="organization-detail">
        <DaemonErrorMessage error={state.error} />
        <Link href="/organizations" className="back-link">
          Back to Organizations
        </Link>
      </div>
    )
  }

  if (!state.organization) {
    return (
      <div className="organization-detail">
        <div className="error-message">Organization not found</div>
        <Link href="/organizations" className="back-link">
          Back to Organizations
        </Link>
      </div>
    )
  }

  return (
    <OrganizationDetailView state={state} organization={state.organization} />
  )
}

function OrganizationDetailView({
  state,
  organization,
}: {
  state: ReturnType<typeof useOrganizationDetailState>
  organization: Organization
}) {
  return (
    <div className="organization-detail">
      <OrganizationHeader
        isEditing={state.isEditing}
        saving={state.saving}
        editName={state.editName}
        onEdit={() => state.setIsEditing(true)}
        onDelete={() => state.setShowDeleteConfirm(true)}
        onCancel={state.handleCancelEdit}
        onSave={state.handleSave}
      />

      {state.error && <DaemonErrorMessage error={state.error} />}

      {state.showDeleteConfirm && (
        <DeleteConfirmDialog
          projects={state.projects}
          deleteError={state.deleteError}
          deleting={state.deleting}
          onCancel={() => {
            state.setShowDeleteConfirm(false)
            state.setDeleteError(null)
          }}
          onConfirm={state.handleDelete}
        />
      )}

      <OrganizationContentView
        organization={organization}
        projects={state.projects}
        isEditing={state.isEditing}
        editName={state.editName}
        editSlug={state.editSlug}
        editDescription={state.editDescription}
        onNameChange={state.setEditName}
        onSlugChange={state.setEditSlug}
        onDescriptionChange={state.setEditDescription}
      />
    </div>
  )
}
