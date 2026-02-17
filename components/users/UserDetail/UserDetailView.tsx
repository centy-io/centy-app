'use client'

import Link from 'next/link'
import type { User } from '@/gen/centy_pb'
import type { RouteLiteral } from 'nextjs-routes'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { UserReadView } from './UserReadView'

interface UserDetailViewProps {
  user: User
  usersListUrl: RouteLiteral | '/'
  error: string | null
  isEditing: boolean
  setIsEditing: (v: boolean) => void
  editName: string
  setEditName: (v: string) => void
  editEmail: string
  setEditEmail: (v: string) => void
  editGitUsernames: string[]
  setEditGitUsernames: (v: string[]) => void
  saving: boolean
  deleting: boolean
  showDeleteConfirm: boolean
  setShowDeleteConfirm: (v: boolean) => void
  handleSave: () => void
  handleDelete: () => void
  handleCancelEdit: () => void
}

export function UserDetailView(props: UserDetailViewProps) {
  const {
    user,
    usersListUrl,
    error,
    isEditing,
    saving,
    deleting,
    showDeleteConfirm,
  } = props
  const handleGitUsernameChange = (index: number, value: string) => {
    const updated = [...props.editGitUsernames]
    updated[index] = value
    props.setEditGitUsernames(updated)
  }
  return (
    <div className="user-detail">
      <div className="user-header">
        <Link href={usersListUrl} className="back-link">
          Back to Users
        </Link>
        <div className="user-actions">
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
          <p>Are you sure you want to delete this user?</p>
          <div className="delete-confirm-actions">
            <button
              onClick={() => props.setShowDeleteConfirm(false)}
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
      <div className="user-content">
        <div className="user-id-badge">@{user.id}</div>
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label htmlFor="edit-name">Name:</label>
              <input
                id="edit-name"
                type="text"
                value={props.editName}
                onChange={e => props.setEditName(e.target.value)}
                placeholder="Display name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-email">Email:</label>
              <input
                id="edit-email"
                type="email"
                value={props.editEmail}
                onChange={e => props.setEditEmail(e.target.value)}
                placeholder="Email address (optional)"
              />
            </div>
            <div className="form-group">
              <label>Git Usernames:</label>
              <div className="git-usernames-list">
                {props.editGitUsernames.map((username, index) => (
                  <div key={index} className="git-username-item">
                    <input
                      type="text"
                      value={username}
                      onChange={e =>
                        handleGitUsernameChange(index, e.target.value)
                      }
                      placeholder="Git username"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        props.setEditGitUsernames(
                          props.editGitUsernames.filter((_, i) => i !== index)
                        )
                      }
                      className="remove-git-username-btn"
                      title="Remove"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    props.setEditGitUsernames([...props.editGitUsernames, ''])
                  }
                  className="add-git-username-btn"
                >
                  + Add Git Username
                </button>
              </div>
            </div>
          </div>
        ) : (
          <UserReadView user={user} />
        )}
      </div>
    </div>
  )
}
