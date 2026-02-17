import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'

interface UserDetailHeaderProps {
  usersListUrl: RouteLiteral | '/'
  isEditing: boolean
  saving: boolean
  editName: string
  setIsEditing: (v: boolean) => void
  setShowDeleteConfirm: (v: boolean) => void
  handleCancelEdit: () => void
  handleSave: () => void
}

export function UserDetailHeader(props: UserDetailHeaderProps) {
  return (
    <div className="user-header">
      <Link href={props.usersListUrl} className="back-link">
        Back to Users
      </Link>
      <div className="user-actions">
        {!props.isEditing ? (
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
              disabled={props.saving || !props.editName.trim()}
              className="save-btn"
            >
              {props.saving ? 'Saving...' : 'Save'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
