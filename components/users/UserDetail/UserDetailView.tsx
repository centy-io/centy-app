'use client'

import type { User } from '@/gen/centy_pb'
import type { RouteLiteral } from 'nextjs-routes'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { UserReadView } from './UserReadView'
import { UserEditForm } from './UserEditForm'
import { UserDetailHeader } from './UserDetailHeader'
import { DeleteConfirmation } from './DeleteConfirmation'

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
  return (
    <div className="user-detail">
      <UserDetailHeader
        usersListUrl={props.usersListUrl}
        isEditing={props.isEditing}
        saving={props.saving}
        editName={props.editName}
        setIsEditing={props.setIsEditing}
        setShowDeleteConfirm={props.setShowDeleteConfirm}
        handleCancelEdit={props.handleCancelEdit}
        handleSave={props.handleSave}
      />
      {props.error && <DaemonErrorMessage error={props.error} />}
      {props.showDeleteConfirm && (
        <DeleteConfirmation
          deleting={props.deleting}
          onCancel={() => props.setShowDeleteConfirm(false)}
          onConfirm={props.handleDelete}
        />
      )}
      <div className="user-content">
        <div className="user-id-badge">@{props.user.id}</div>
        {props.isEditing ? (
          <UserEditForm
            editName={props.editName}
            setEditName={props.setEditName}
            editEmail={props.editEmail}
            setEditEmail={props.setEditEmail}
            editGitUsernames={props.editGitUsernames}
            setEditGitUsernames={props.setEditGitUsernames}
          />
        ) : (
          <UserReadView user={props.user} />
        )}
      </div>
    </div>
  )
}
