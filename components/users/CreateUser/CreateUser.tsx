'use client'

import Link from 'next/link'
import { useCreateUser } from './useCreateUser'
import { CreateUserForm } from './CreateUserForm'

export function CreateUser() {
  const hook = useCreateUser()

  if (!hook.projectPath) {
    return (
      <div className="create-user">
        <div className="error-message">
          No project path specified. Please go to the{' '}
          <Link href={hook.usersListUrl}>users list</Link> and select a project.
        </div>
      </div>
    )
  }
  if (hook.isInitialized === false) {
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
      <CreateUserForm
        usersListUrl={hook.usersListUrl}
        error={hook.error}
        name={hook.name}
        setName={hook.setName}
        userId={hook.userId}
        handleUserIdChange={hook.handleUserIdChange}
        email={hook.email}
        setEmail={hook.setEmail}
        gitUsernames={hook.gitUsernames}
        setGitUsernames={hook.setGitUsernames}
        saving={hook.saving}
        handleSubmit={hook.handleSubmit}
      />
    </div>
  )
}
