'use client'

import Link from 'next/link'
import { useCreateUser } from './useCreateUser'
import { CreateUserForm } from './CreateUserForm'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function CreateUser() {
  const state = useCreateUser()

  if (!state.projectPath) {
    return (
      <div className="create-user">
        <div className="error-message">
          No project path specified. Please go to the{' '}
          <Link href={state.usersListUrl}>users list</Link> and select a
          project.
        </div>
      </div>
    )
  }

  if (state.isInitialized === false) {
    return (
      <div className="create-user">
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/">Initialize Project</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="create-user">
      <div className="create-user-header">
        <Link href={state.usersListUrl} className="back-link">
          Back to Users
        </Link>
        <h2>Create New User</h2>
      </div>
      {state.error && <DaemonErrorMessage error={state.error} />}
      <CreateUserForm
        name={state.name}
        setName={state.setName}
        userId={state.userId}
        onUserIdChange={state.onUserIdChange}
        email={state.email}
        setEmail={state.setEmail}
        gitUsernames={state.gitUsernames}
        onAddGitUsername={state.onAddGitUsername}
        onRemoveGitUsername={state.onRemoveGitUsername}
        onGitUsernameChange={state.onGitUsernameChange}
        saving={state.saving}
        onSubmit={state.handleSubmit}
        usersListUrl={state.usersListUrl}
      />
    </div>
  )
}
