'use client'

interface UserEditFormProps {
  editName: string
  setEditName: (value: string) => void
  editEmail: string
  setEditEmail: (value: string) => void
  editGitUsernames: string[]
  setEditGitUsernames: (value: string[]) => void
}

// eslint-disable-next-line max-lines-per-function
export function UserEditForm({
  editName,
  setEditName,
  editEmail,
  setEditEmail,
  editGitUsernames,
  setEditGitUsernames,
}: UserEditFormProps) {
  const handleGitUsernameChange = (index: number, value: string) => {
    const updated = [...editGitUsernames]
    // eslint-disable-next-line security/detect-object-injection
    updated[index] = value
    setEditGitUsernames(updated)
  }

  return (
    <div className="edit-form">
      <div className="form-group">
        <label className="form-label" htmlFor="edit-name">Name:</label>
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
        <label className="form-label" htmlFor="edit-email">Email:</label>
        <input
          className="form-input"
          id="edit-email"
          type="email"
          value={editEmail}
          onChange={e => setEditEmail(e.target.value)}
          placeholder="Email address (optional)"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Git Usernames:</label>
        <div className="git-usernames-list">
          {editGitUsernames.map((username, index) => (
            <div key={index} className="git-username-item">
              <input
                className="form-input"
                type="text"
                value={username}
                onChange={e => handleGitUsernameChange(index, e.target.value)}
                placeholder="Git username"
              />
              <button
                type="button"
                onClick={() =>
                  setEditGitUsernames(
                    editGitUsernames.filter((_, i) => i !== index)
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
            onClick={() => setEditGitUsernames([...editGitUsernames, ''])}
            className="add-git-username-btn"
          >
            + Add Git Username
          </button>
        </div>
      </div>
    </div>
  )
}
