'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { route, type RouteLiteral } from 'nextjs-routes'
import { useUserData } from './useUserData'
import { UserEditForm } from './UserEditForm'
import { UserMetadata } from './UserMetadata'
import { UserDetailActions } from './UserDetailActions'
import {
  NoProjectState,
  LoadingState,
  ErrorState,
  NotFoundState,
} from './UserDetailStates'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface UserDetailProps {
  userId: string
}

export function UserDetail({ userId }: UserDetailProps) {
  const params = useParams()
  const usersListUrl: RouteLiteral | '/' = useMemo(() => {
    const orgP = params ? params.organization : undefined
    const org = typeof orgP === 'string' ? orgP : undefined
    const projP = params ? params.project : undefined
    const proj = typeof projP === 'string' ? projP : undefined
    if (org && proj) {
      return route({
        pathname: '/[organization]/[project]/users',
        query: { organization: org, project: proj },
      })
    }
    return '/'
  }, [params])

  const data = useUserData(userId, usersListUrl)

  useSaveShortcut({
    onSave: data.handleSave,
    enabled: data.isEditing && !data.saving && !!data.editName.trim(),
  })

  if (!data.projectPath) return <NoProjectState usersListUrl={usersListUrl} />
  if (data.loading) return <LoadingState />
  if (data.error && !data.user)
    return <ErrorState usersListUrl={usersListUrl} error={data.error} />
  if (!data.user) return <NotFoundState usersListUrl={usersListUrl} />

  const handleCancelEdit = () => {
    data.setIsEditing(false)
    if (!data.user) return
    data.setEditName(data.user.name)
    data.setEditEmail(data.user.email || '')
    data.setEditGitUsernames([...data.user.gitUsernames])
  }

  return (
    <div className="user-detail">
      <UserDetailActions
        usersListUrl={usersListUrl}
        isEditing={data.isEditing}
        saving={data.saving}
        editName={data.editName}
        onEdit={() => data.setIsEditing(true)}
        onDelete={() => data.setShowDeleteConfirm(true)}
        onCancelEdit={handleCancelEdit}
        onSave={data.handleSave}
      />
      {data.error && <DaemonErrorMessage error={data.error} />}
      {data.showDeleteConfirm && (
        <DeleteConfirmDialog
          message="Are you sure you want to delete this user?"
          onCancel={() => data.setShowDeleteConfirm(false)}
          onConfirm={data.handleDelete}
          deleting={data.deleting}
        />
      )}
      <div className="user-content">
        <div className="user-id-badge">@{data.user.id}</div>
        {data.isEditing ? (
          <UserEditForm {...data} />
        ) : (
          <UserMetadata user={data.user} />
        )}
      </div>
    </div>
  )
}
