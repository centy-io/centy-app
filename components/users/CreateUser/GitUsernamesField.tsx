'use client'

interface GitUsernamesFieldProps {
  gitUsernames: string[]
  onAddGitUsername: () => void
  onRemoveGitUsername: (i: number) => void
  onGitUsernameChange: (i: number, v: string) => void
}

export function GitUsernamesField({
  gitUsernames,
  onAddGitUsername,
  onRemoveGitUsername,
  onGitUsernameChange,
}: GitUsernamesFieldProps) {
  return (
    <div className="form-group">
      <label>Git Usernames</label>
      <div className="git-usernames-list">
        {gitUsernames.map((username, index) => (
          <div key={index} className="git-username-item">
            <input
              type="text"
              value={username}
              onChange={e => onGitUsernameChange(index, e.target.value)}
              placeholder="Git username"
            />
            <button
              type="button"
              onClick={() => onRemoveGitUsername(index)}
              className="remove-git-username-btn"
              title="Remove"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddGitUsername}
          className="add-git-username-btn"
        >
          + Add Git Username
        </button>
      </div>
    </div>
  )
}
