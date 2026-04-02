'use client'

import { type RouteLiteral } from 'nextjs-routes'
import { NameField } from './NameField'
import { UserIdField } from './UserIdField'
import { EmailField } from './EmailField'
import { GitUsernamesField } from './GitUsernamesField'
import { FormActions } from './FormActions'

interface CreateUserFormProps {
  name: string
  setName: (v: string) => void
  userId: string
  onUserIdChange: (v: string) => void
  email: string
  setEmail: (v: string) => void
  gitUsernames: string[]
  onAddGitUsername: () => void
  onRemoveGitUsername: (i: number) => void
  onGitUsernameChange: (i: number, v: string) => void
  saving: boolean
  onSubmit: () => void
  usersListUrl: RouteLiteral
}

export function CreateUserForm({
  name,
  setName,
  userId,
  onUserIdChange,
  email,
  setEmail,
  gitUsernames,
  onAddGitUsername,
  onRemoveGitUsername,
  onGitUsernameChange,
  saving,
  onSubmit,
  usersListUrl,
}: CreateUserFormProps) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSubmit()
      }}
      className="create-user-form"
    >
      <NameField name={name} setName={setName} />
      <UserIdField userId={userId} onUserIdChange={onUserIdChange} />
      <EmailField email={email} setEmail={setEmail} />
      <GitUsernamesField
        gitUsernames={gitUsernames}
        onAddGitUsername={onAddGitUsername}
        onRemoveGitUsername={onRemoveGitUsername}
        onGitUsernameChange={onGitUsernameChange}
      />
      <FormActions saving={saving} name={name} usersListUrl={usersListUrl} />
    </form>
  )
}
