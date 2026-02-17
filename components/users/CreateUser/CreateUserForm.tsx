import Link from 'next/link'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import type { RouteLiteral } from 'nextjs-routes'
import { GitUsernamesField } from './GitUsernamesField'

interface CreateUserFormProps {
  usersListUrl: RouteLiteral | '/'
  error: string | null
  name: string
  setName: (v: string) => void
  userId: string
  handleUserIdChange: (v: string) => void
  email: string
  setEmail: (v: string) => void
  gitUsernames: string[]
  setGitUsernames: (v: string[]) => void
  saving: boolean
  handleSubmit: () => void
}

export function CreateUserForm(props: CreateUserFormProps) {
  return (
    <>
      <div className="create-user-header">
        <Link href={props.usersListUrl} className="back-link">
          Back to Users
        </Link>
        <h2>Create New User</h2>
      </div>
      {props.error && <DaemonErrorMessage error={props.error} />}
      <form
        onSubmit={e => {
          e.preventDefault()
          props.handleSubmit()
        }}
        className="create-user-form"
      >
        <div className="form-group">
          <label htmlFor="name">
            Name <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={props.name}
            onChange={e => props.setName(e.target.value)}
            placeholder="Display name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="userId">User ID</label>
          <input
            id="userId"
            type="text"
            value={props.userId}
            onChange={e => props.handleUserIdChange(e.target.value)}
            placeholder="Auto-generated from name"
          />
          <span className="form-hint">
            Unique identifier (slug format). Leave empty to auto-generate.
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={props.email}
            onChange={e => props.setEmail(e.target.value)}
            placeholder="Email address (optional)"
          />
        </div>
        <GitUsernamesField
          gitUsernames={props.gitUsernames}
          setGitUsernames={props.setGitUsernames}
        />
        <div className="form-actions">
          <Link href={props.usersListUrl} className="cancel-btn">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={props.saving || !props.name.trim()}
            className="save-btn"
          >
            {props.saving ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </>
  )
}
