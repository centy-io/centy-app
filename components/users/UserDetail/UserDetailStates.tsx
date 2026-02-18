'use client'

import Link from 'next/link'
import { type RouteLiteral } from 'nextjs-routes'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface StateProps {
  usersListUrl: RouteLiteral | '/'
}

export function NoProjectState({ usersListUrl }: StateProps) {
  return (
    <div className="user-detail">
      <div className="error-message">
        No project path specified. Please go to the{' '}
        <Link href={usersListUrl}>users list</Link> and select a project.
      </div>
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="user-detail">
      <div className="loading">Loading user...</div>
    </div>
  )
}

export function ErrorState({
  usersListUrl,
  error,
}: StateProps & { error: string }) {
  return (
    <div className="user-detail">
      <DaemonErrorMessage error={error} />
      <Link href={usersListUrl} className="back-link">
        Back to Users
      </Link>
    </div>
  )
}

export function NotFoundState({ usersListUrl }: StateProps) {
  return (
    <div className="user-detail">
      <div className="error-message">User not found</div>
      <Link href={usersListUrl} className="back-link">
        Back to Users
      </Link>
    </div>
  )
}
