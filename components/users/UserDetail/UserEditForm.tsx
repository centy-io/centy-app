'use client'

import { EditGitUsernamesField } from './EditGitUsernamesField'

interface UserEditFormProps {
  editName: string
  setEditName: (value: string) => void
  editEmail: string
  setEditEmail: (value: string) => void
  editGitUsernames: string[]
  setEditGitUsernames: (value: string[]) => void
}

export function UserEditForm({
  editName,
  setEditName,
  editEmail,
  setEditEmail,
  editGitUsernames,
  setEditGitUsernames,
}: UserEditFormProps) {
  return (
    <div className="edit-form">
      <div className="form-group">
        <label className="form-label" htmlFor="edit-name">
          Name:
        </label>
        <input
          className="form-input"
          id="edit-name"
          type="text"
          value={editName}
          onChange={e => setEditName(e.target.value)}
          placeholder="Display name"
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="edit-email">
          Email:
        </label>
        <input
          className="form-input"
          id="edit-email"
          type="email"
          value={editEmail}
          onChange={e => setEditEmail(e.target.value)}
          placeholder="Email address (optional)"
        />
      </div>
      <EditGitUsernamesField
        editGitUsernames={editGitUsernames}
        setEditGitUsernames={setEditGitUsernames}
      />
    </div>
  )
}
