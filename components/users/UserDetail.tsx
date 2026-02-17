'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { route, type RouteLiteral } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetUserRequestSchema,
  UpdateUserRequestSchema,
  DeleteUserRequestSchema,
  type User,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

interface UserDetailProps {
  userId: string
}

function handleDetailDaemonError(
  message: string,
  setError: (error: string) => void
) {
  if (isDaemonUnimplemented(message)) {
    setError(
      'User management is not yet available. Please update your daemon to the latest version.'
    )
  } else {
    setError(message)
  }
}

interface UserEditFormProps {
  editName: string
  setEditName: (v: string) => void
  editEmail: string
  setEditEmail: (v: string) => void
  editGitUsernames: string[]
  onAddGitUsername: () => void
  onRemoveGitUsername: (index: number) => void
  onGitUsernameChange: (index: number, value: string) => void
}

function UserEditForm({
  editName,
  setEditName,
  editEmail,
  setEditEmail,
  editGitUsernames,
  onAddGitUsername,
  onRemoveGitUsername,
  onGitUsernameChange,
}: UserEditFormProps) {
  return (
    <div className="edit-form">
      <div className="form-group">
        <label htmlFor="edit-name">Name:</label>
        <input
          id="edit-name"
          type="text"
          value={editName}
          onChange={e => setEditName(e.target.value)}
          placeholder="Display name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="edit-email">Email:</label>
        <input
          id="edit-email"
          type="email"
          value={editEmail}
          onChange={e => setEditEmail(e.target.value)}
          placeholder="Email address (optional)"
        />
      </div>

      <div className="form-group">
        <label>Git Usernames:</label>
        <div className="git-usernames-list">
          {editGitUsernames.map((username, index) => (
            <div key={index} className="git-username-item">
              <input
                type="text"
                value={username}
                onChange={e => onGitUsernameChange(index, e.target.value)}
                placeholder="Git username"
              />
              <button
                type="button"
                onClick={() => onRemoveGitUsername(index)}
                className="remove-git-username-btn"
                title="Remove"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={onAddGitUsername}
            className="add-git-username-btn"
          >
            + Add Git Username
          </button>
        </div>
      </div>
    </div>
  )
}

function UserViewMode({ user }: { user: User }) {
  return (
    <>
      <h1 className="user-name">{user.name}</h1>

      <div className="user-metadata">
        <div className="metadata-row">
          <span className="metadata-label">Email:</span>
          <span className="metadata-value">
            {user.email || <span className="no-value">Not set</span>}
          </span>
        </div>

        <div className="metadata-row">
          <span className="metadata-label">Git Usernames:</span>
          <span className="metadata-value">
            {user.gitUsernames.length > 0 ? (
              user.gitUsernames.map((username, i) => (
                <span key={i} className="git-username-badge">
                  {username}
                </span>
              ))
            ) : (
              <span className="no-value">None</span>
            )}
          </span>
        </div>

        <div className="metadata-row">
          <span className="metadata-label">Created:</span>
          <span className="metadata-value">
            {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}
          </span>
        </div>

        {user.updatedAt && (
          <div className="metadata-row">
            <span className="metadata-label">Updated:</span>
            <span className="metadata-value">
              {new Date(user.updatedAt).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </>
  )
}

interface UserDetailHeaderProps {
  usersListUrl: RouteLiteral | '/'
  isEditing: boolean
  saving: boolean
  editName: string
  onEdit: () => void
  onDelete: () => void
  onCancelEdit: () => void
  onSave: () => void
}

function UserDetailHeader({
  usersListUrl,
  isEditing,
  saving,
  editName,
  onEdit,
  onDelete,
  onCancelEdit,
  onSave,
}: UserDetailHeaderProps) {
  return (
    <div className="user-header">
      <Link href={usersListUrl} className="back-link">
        Back to Users
      </Link>

      <div className="user-actions">
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
            <button onClick={onCancelEdit} className="cancel-btn">
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

function useFetchUser(projectPath: string, userId: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    if (!projectPath || !userId) {
      setError('Missing project path or user ID')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const request = create(GetUserRequestSchema, { projectPath, userId })
      const response = await centyClient.getUser(request)
      if (response.user) {
        setUser(response.user)
      } else {
        setError(response.error || 'User not found')
      }
    } catch (err) {
      handleDetailDaemonError(
        err instanceof Error ? err.message : 'Failed to connect to daemon',
        setError
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return { user, setUser, loading, error, setError }
}

function useUserSave(
  projectPath: string,
  userId: string,
  editName: string,
  editEmail: string,
  editGitUsernames: string[],
  setUser: (u: User) => void,
  setIsEditing: (v: boolean) => void,
  setError: (e: string | null) => void
) {
  const [saving, setSaving] = useState(false)

  const handleSave = useCallback(async () => {
    if (!projectPath || !userId) return
    setSaving(true)
    setError(null)
    try {
      const request = create(UpdateUserRequestSchema, {
        projectPath,
        userId,
        name: editName,
        email: editEmail,
        gitUsernames: editGitUsernames.filter(u => u.trim() !== ''),
      })
      const response = await centyClient.updateUser(request)
      if (response.success && response.user) {
        setUser(response.user)
        setIsEditing(false)
      } else {
        handleDetailDaemonError(
          response.error || 'Failed to update user',
          setError
        )
      }
    } catch (err) {
      handleDetailDaemonError(
        err instanceof Error ? err.message : 'Failed to connect to daemon',
        setError
      )
    } finally {
      setSaving(false)
    }
  }, [
    projectPath,
    userId,
    editName,
    editEmail,
    editGitUsernames,
    setUser,
    setIsEditing,
    setError,
  ])

  return { saving, handleSave }
}

function useUserDelete(
  projectPath: string,
  userId: string,
  router: ReturnType<typeof useRouter>,
  usersListUrl: RouteLiteral | '/',
  setError: (e: string | null) => void,
  setShowDeleteConfirm: (v: boolean) => void
) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = useCallback(async () => {
    if (!projectPath || !userId) return
    setDeleting(true)
    setError(null)
    try {
      const request = create(DeleteUserRequestSchema, { projectPath, userId })
      const response = await centyClient.deleteUser(request)
      if (response.success) {
        router.push(usersListUrl)
      } else {
        handleDetailDaemonError(
          response.error || 'Failed to delete user',
          setError
        )
        setShowDeleteConfirm(false)
      }
    } catch (err) {
      handleDetailDaemonError(
        err instanceof Error ? err.message : 'Failed to connect to daemon',
        setError
      )
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }, [
    projectPath,
    userId,
    router,
    usersListUrl,
    setError,
    setShowDeleteConfirm,
  ])

  return { deleting, handleDelete }
}

function useEditGitUsernames(initial: string[]) {
  const [editGitUsernames, setEditGitUsernames] = useState<string[]>(initial)
  const handleAdd = () => {
    setEditGitUsernames([...editGitUsernames, ''])
  }
  const handleRemove = (index: number) => {
    setEditGitUsernames(editGitUsernames.filter((_, i) => i !== index))
  }
  const handleChange = (index: number, value: string) => {
    const updated = [...editGitUsernames]
    updated[index] = value
    setEditGitUsernames(updated)
  }
  return {
    editGitUsernames,
    setEditGitUsernames,
    handleAdd,
    handleRemove,
    handleChange,
  }
}

interface DeleteConfirmProps {
  onCancel: () => void
  onDelete: () => void
  deleting: boolean
}

function DeleteConfirmBar({
  onCancel,
  onDelete,
  deleting,
}: DeleteConfirmProps) {
  return (
    <div className="delete-confirm">
      <p>Are you sure you want to delete this user?</p>
      <div className="delete-confirm-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="confirm-delete-btn"
        >
          {deleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  )
}

function useDetailProjectContext(params: ReturnType<typeof useParams>) {
  const projectContext = useMemo(() => {
    const org = params ? (params.organization as string | undefined) : undefined
    const project = params ? (params.project as string | undefined) : undefined
    if (org && project) return { organization: org, project }
    return null
  }, [params])

  const usersListUrl: RouteLiteral | '/' = useMemo(() => {
    if (projectContext) {
      return route({
        pathname: '/[organization]/[project]/users',
        query: projectContext,
      })
    }
    return '/'
  }, [projectContext])

  return { projectContext, usersListUrl }
}

function useUserEditFields(user: User | null) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const {
    editGitUsernames,
    setEditGitUsernames,
    handleAdd,
    handleRemove,
    handleChange,
  } = useEditGitUsernames([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!user) return
    setEditName(user.name)
    setEditEmail(user.email || '')
    setEditGitUsernames([...user.gitUsernames])
  }, [user, setEditGitUsernames])

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (!user) return
    setEditName(user.name)
    setEditEmail(user.email || '')
    setEditGitUsernames([...user.gitUsernames])
  }

  return {
    isEditing,
    setIsEditing,
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    editGitUsernames,
    handleAdd,
    handleRemove,
    handleChange,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleCancelEdit,
  }
}

function useUserDetailState(
  projectPath: string,
  userId: string,
  router: ReturnType<typeof useRouter>,
  usersListUrl: RouteLiteral | '/'
) {
  const { user, setUser, loading, error, setError } = useFetchUser(
    projectPath,
    userId
  )
  const editFields = useUserEditFields(user)

  const { saving, handleSave } = useUserSave(
    projectPath,
    userId,
    editFields.editName,
    editFields.editEmail,
    editFields.editGitUsernames,
    setUser,
    editFields.setIsEditing,
    setError
  )
  const { deleting, handleDelete } = useUserDelete(
    projectPath,
    userId,
    router,
    usersListUrl,
    setError,
    editFields.setShowDeleteConfirm
  )

  return {
    user,
    loading,
    error,
    saving,
    handleSave,
    deleting,
    handleDelete,
    ...editFields,
  }
}

interface UserDetailContentProps {
  user: User
  usersListUrl: RouteLiteral | '/'
  isEditing: boolean
  saving: boolean
  editName: string
  setEditName: (v: string) => void
  editEmail: string
  setEditEmail: (v: string) => void
  editGitUsernames: string[]
  onAddGitUsername: () => void
  onRemoveGitUsername: (index: number) => void
  onGitUsernameChange: (index: number, value: string) => void
  showDeleteConfirm: boolean
  setShowDeleteConfirm: (v: boolean) => void
  deleting: boolean
  error: string | null
  onEdit: () => void
  onDelete: () => void
  onCancelEdit: () => void
  onSave: () => void
  handleDelete: () => void
}

function UserDetailContent({
  user,
  usersListUrl,
  isEditing,
  saving,
  editName,
  setEditName,
  editEmail,
  setEditEmail,
  editGitUsernames,
  onAddGitUsername,
  onRemoveGitUsername,
  onGitUsernameChange,
  showDeleteConfirm,
  setShowDeleteConfirm,
  deleting,
  error,
  onEdit,
  onDelete,
  onCancelEdit,
  onSave,
  handleDelete,
}: UserDetailContentProps) {
  return (
    <div className="user-detail">
      <UserDetailHeader
        usersListUrl={usersListUrl}
        isEditing={isEditing}
        saving={saving}
        editName={editName}
        onEdit={onEdit}
        onDelete={onDelete}
        onCancelEdit={onCancelEdit}
        onSave={onSave}
      />
      {error && <DaemonErrorMessage error={error} />}
      {showDeleteConfirm && (
        <DeleteConfirmBar
          onCancel={() => setShowDeleteConfirm(false)}
          onDelete={handleDelete}
          deleting={deleting}
        />
      )}
      <div className="user-content">
        <div className="user-id-badge">@{user.id}</div>
        {isEditing ? (
          <UserEditForm
            editName={editName}
            setEditName={setEditName}
            editEmail={editEmail}
            setEditEmail={setEditEmail}
            editGitUsernames={editGitUsernames}
            onAddGitUsername={onAddGitUsername}
            onRemoveGitUsername={onRemoveGitUsername}
            onGitUsernameChange={onGitUsernameChange}
          />
        ) : (
          <UserViewMode user={user} />
        )}
      </div>
    </div>
  )
}

function UserDetailGuard({
  projectPath,
  usersListUrl,
  loading,
  error,
  user,
}: {
  projectPath: string
  usersListUrl: RouteLiteral | '/'
  loading: boolean
  error: string | null
  user: User | null
}) {
  if (!projectPath) {
    return (
      <div className="user-detail">
        <div className="error-message">
          No project path specified. Please go to the{' '}
          <Link href={usersListUrl}>users list</Link> and select a project.
        </div>
      </div>
    )
  }
  if (loading) {
    return (
      <div className="user-detail">
        <div className="loading">Loading user...</div>
      </div>
    )
  }
  if (error && !user) {
    return (
      <div className="user-detail">
        <DaemonErrorMessage error={error} />
        <Link href={usersListUrl} className="back-link">
          Back to Users
        </Link>
      </div>
    )
  }
  if (!user) {
    return (
      <div className="user-detail">
        <div className="error-message">User not found</div>
        <Link href={usersListUrl} className="back-link">
          Back to Users
        </Link>
      </div>
    )
  }
  return null
}

export function UserDetail({ userId }: UserDetailProps) {
  const router = useRouter()
  const params = useParams()
  const { projectPath } = useProject()
  const { usersListUrl } = useDetailProjectContext(params)

  const state = useUserDetailState(projectPath, userId, router, usersListUrl)

  useSaveShortcut({
    onSave: state.handleSave,
    enabled: state.isEditing && !state.saving && !!state.editName.trim(),
  })

  const guard = UserDetailGuard({
    projectPath,
    usersListUrl,
    loading: state.loading,
    error: state.error,
    user: state.user,
  })
  if (guard) return guard

  return (
    <UserDetailContent
      user={state.user!}
      usersListUrl={usersListUrl}
      isEditing={state.isEditing}
      saving={state.saving}
      editName={state.editName}
      setEditName={state.setEditName}
      editEmail={state.editEmail}
      setEditEmail={state.setEditEmail}
      editGitUsernames={state.editGitUsernames}
      onAddGitUsername={state.handleAdd}
      onRemoveGitUsername={state.handleRemove}
      onGitUsernameChange={state.handleChange}
      showDeleteConfirm={state.showDeleteConfirm}
      setShowDeleteConfirm={state.setShowDeleteConfirm}
      deleting={state.deleting}
      error={state.error}
      onEdit={() => state.setIsEditing(true)}
      onDelete={() => state.setShowDeleteConfirm(true)}
      onCancelEdit={state.handleCancelEdit}
      onSave={state.handleSave}
      handleDelete={state.handleDelete}
    />
  )
}
