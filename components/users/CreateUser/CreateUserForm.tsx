/* eslint-disable max-lines */
'use client'

import Link from 'next/link'
import { type RouteLiteral } from 'nextjs-routes'
import { GitUsernamesField } from './GitUsernamesField'

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
  usersListUrl: RouteLiteral | '/'
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
      <div className="form-group">
        <label className="form-label" htmlFor="name">Name <span className="required">*</span></label>
        <input className="form-input" id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Display name" required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="userId">User ID</label>
        <input className="form-input" id="userId" type="text" value={userId} onChange={e => onUserIdChange(e.target.value)} placeholder="Auto-generated from name" />
        <span className="form-hint">
          Unique identifier (slug format). Leave empty to auto-generate.
        </span>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="email">Email</label>
        <input className="form-input" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address (optional)" />
      </div>
      <GitUsernamesField
        gitUsernames={gitUsernames}
        onAddGitUsername={onAddGitUsername}
        onRemoveGitUsername={onRemoveGitUsername}
        onGitUsernameChange={onGitUsernameChange}
      />
      <div className="form-actions">
        <Link href={usersListUrl} className="cancel-btn">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="save-btn"
        >
          {saving ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </form>
  )
}
