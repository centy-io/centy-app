'use client'

import Link from 'next/link'
import { type RouteLiteral } from 'nextjs-routes'

interface UserDetailActionsProps {
  usersListUrl: RouteLiteral | '/'
  isEditing: boolean
  saving: boolean
  editName: string
  onEdit: () => void
  onDelete: () => void
  onCancelEdit: () => void
  onSave: () => void
}

export function UserDetailActions({
  usersListUrl,
  isEditing,
  saving,
  editName,
  onEdit,
  onDelete,
  onCancelEdit,
  onSave,
}: UserDetailActionsProps) {
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
