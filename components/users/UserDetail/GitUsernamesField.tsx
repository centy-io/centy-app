'use client'

interface GitUsernamesFieldProps {
  editGitUsernames: string[]
  setEditGitUsernames: (value: string[]) => void
}

export function GitUsernamesField({
  editGitUsernames,
  setEditGitUsernames,
}: GitUsernamesFieldProps) {
  const handleGitUsernameChange = (index: number, value: string) => {
    const updated = [...editGitUsernames]
    updated.splice(index, 1, value)
    setEditGitUsernames(updated)
  }

  return (
    <div className="form-group">
      <label className="form-label">Git Usernames:</label>
      <div className="git-usernames-list">
        {editGitUsernames.map((username, index) => (
          <div key={index} className="git-username-item">
            <input
              className="form-input"
              type="text"
              value={username}
              onChange={e => {
                handleGitUsernameChange(index, e.target.value)
              }}
              placeholder="Git username"
            />
            <button
              type="button"
              onClick={() => {
                setEditGitUsernames(
                  editGitUsernames.filter((_, i) => i !== index)
                )
              }}
              className="remove-git-username-btn"
              title="Remove"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            setEditGitUsernames([...editGitUsernames, ''])
          }}
          className="add-git-username-btn"
        >
          + Add Git Username
        </button>
      </div>
    </div>
  )
}
