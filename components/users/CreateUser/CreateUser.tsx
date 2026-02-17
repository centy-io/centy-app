'use client'

import Link from 'next/link'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useCreateUser } from './useCreateUser'

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
      <div className="create-user-header">
        <Link href={hook.usersListUrl} className="back-link">
          Back to Users
        </Link>
        <h2>Create New User</h2>
      </div>
      {hook.error && <DaemonErrorMessage error={hook.error} />}
      <form
        onSubmit={e => {
          e.preventDefault()
          hook.handleSubmit()
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
            value={hook.name}
            onChange={e => hook.setName(e.target.value)}
            placeholder="Display name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="userId">User ID</label>
          <input
            id="userId"
            type="text"
            value={hook.userId}
            onChange={e => hook.handleUserIdChange(e.target.value)}
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
            value={hook.email}
            onChange={e => hook.setEmail(e.target.value)}
            placeholder="Email address (optional)"
          />
        </div>
        <div className="form-group">
          <label>Git Usernames</label>
          <div className="git-usernames-list">
            {hook.gitUsernames.map((username, index) => (
              <div key={index} className="git-username-item">
                <input
                  type="text"
                  value={username}
                  onChange={e => {
                    const u = [...hook.gitUsernames]
                    u[index] = e.target.value
                    hook.setGitUsernames(u)
                  }}
                  placeholder="Git username"
                />
                <button
                  type="button"
                  onClick={() =>
                    hook.setGitUsernames(
                      hook.gitUsernames.filter((_, i) => i !== index)
                    )
                  }
                  className="remove-git-username-btn"
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => hook.setGitUsernames([...hook.gitUsernames, ''])}
              className="add-git-username-btn"
            >
              + Add Git Username
            </button>
          </div>
        </div>
        <div className="form-actions">
          <Link href={hook.usersListUrl} className="cancel-btn">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={hook.saving || !hook.name.trim()}
            className="save-btn"
          >
            {hook.saving ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  )
}
