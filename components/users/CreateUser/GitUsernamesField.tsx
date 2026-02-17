interface GitUsernamesFieldProps {
  gitUsernames: string[]
  setGitUsernames: (v: string[]) => void
}

export function GitUsernamesField({
  gitUsernames,
  setGitUsernames,
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
              onChange={e => {
                const u = [...gitUsernames]
                u[index] = e.target.value
                setGitUsernames(u)
              }}
              placeholder="Git username"
            />
            <button
              type="button"
              onClick={() =>
                setGitUsernames(gitUsernames.filter((_, i) => i !== index))
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
          onClick={() => setGitUsernames([...gitUsernames, ''])}
          className="add-git-username-btn"
        >
          + Add Git Username
        </button>
      </div>
    </div>
  )
}
