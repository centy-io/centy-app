'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { route, type RouteLiteral } from 'nextjs-routes'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import type { UserDetailProps } from './UserDetail.types'
import { useUserDetail } from './useUserDetail'
import { UserDetailView } from './UserDetailView'

export function UserDetail({ userId }: UserDetailProps) {
  const params = useParams()
  const projectContext = useMemo(() => {
    const org = params?.organization as string | undefined
    const project = params?.project as string | undefined
    return org && project ? { organization: org, project } : null
  }, [params])
  const usersListUrl: RouteLiteral | '/' = useMemo(() => {
    if (!projectContext) return '/'
    return route({
      pathname: '/[organization]/[project]/users',
      query: projectContext,
    })
  }, [projectContext])

  const hook = useUserDetail(userId, usersListUrl)

  if (!hook.projectPath) {
    return (
      <div className="user-detail">
        <div className="error-message">
          No project path specified. Please go to the{' '}
          <Link href={usersListUrl}>users list</Link> and select a project.
        </div>
      </div>
    )
  }
  if (hook.loading) {
    return (
      <div className="user-detail">
        <div className="loading">Loading user...</div>
      </div>
    )
  }
  if (hook.error && !hook.user) {
    return (
      <div className="user-detail">
        <DaemonErrorMessage error={hook.error} />
        <Link href={usersListUrl} className="back-link">
          Back to Users
        </Link>
      </div>
    )
  }
  if (!hook.user) {
    return (
      <div className="user-detail">
        <div className="error-message">User not found</div>
        <Link href={usersListUrl} className="back-link">
          Back to Users
        </Link>
      </div>
    )
  }

  return (
    <UserDetailView
      user={hook.user}
      usersListUrl={usersListUrl}
      error={hook.error}
      isEditing={hook.isEditing}
      setIsEditing={hook.setIsEditing}
      editName={hook.editName}
      setEditName={hook.setEditName}
      editEmail={hook.editEmail}
      setEditEmail={hook.setEditEmail}
      editGitUsernames={hook.editGitUsernames}
      setEditGitUsernames={hook.setEditGitUsernames}
      saving={hook.saving}
      deleting={hook.deleting}
      showDeleteConfirm={hook.showDeleteConfirm}
      setShowDeleteConfirm={hook.setShowDeleteConfirm}
      handleSave={hook.handleSave}
      handleDelete={hook.handleDelete}
      handleCancelEdit={hook.handleCancelEdit}
    />
  )
}
