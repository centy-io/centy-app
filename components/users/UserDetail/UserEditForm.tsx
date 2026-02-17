interface UserEditFormProps {
  editName: string
  setEditName: (v: string) => void
  editEmail: string
  setEditEmail: (v: string) => void
  editGitUsernames: string[]
  setEditGitUsernames: (v: string[]) => void
}

export function UserEditForm(props: UserEditFormProps) {
  const handleGitUsernameChange = (index: number, value: string) => {
    const updated = [...props.editGitUsernames]
    updated[index] = value
    props.setEditGitUsernames(updated)
  }

  return (
    <div className="edit-form">
      <div className="form-group">
        <label htmlFor="edit-name">Name:</label>
        <input
          id="edit-name"
          type="text"
          value={props.editName}
          onChange={e => props.setEditName(e.target.value)}
          placeholder="Display name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="edit-email">Email:</label>
        <input
          id="edit-email"
          type="email"
          value={props.editEmail}
          onChange={e => props.setEditEmail(e.target.value)}
          placeholder="Email address (optional)"
        />
      </div>
      <div className="form-group">
        <label>Git Usernames:</label>
        <div className="git-usernames-list">
          {props.editGitUsernames.map((username, index) => (
            <div key={index} className="git-username-item">
              <input
                type="text"
                value={username}
                onChange={e => handleGitUsernameChange(index, e.target.value)}
                placeholder="Git username"
              />
              <button
                type="button"
                onClick={() =>
                  props.setEditGitUsernames(
                    props.editGitUsernames.filter((_, i) => i !== index)
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
            onClick={() =>
              props.setEditGitUsernames([...props.editGitUsernames, ''])
            }
            className="add-git-username-btn"
          >
            + Add Git Username
          </button>
        </div>
      </div>
    </div>
  )
}
