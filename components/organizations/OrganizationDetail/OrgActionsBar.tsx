'use client'

interface ActionsBarProps {
  isEditing: boolean
  saving: boolean
  editName: string
  setIsEditing: (v: boolean) => void
  setShowDeleteConfirm: (v: boolean) => void
  handleSave: () => Promise<void>
  handleCancelEdit: () => void
}

export function OrgActionsBar(props: ActionsBarProps): React.JSX.Element {
  const {
    isEditing,
    saving,
    editName,
    setIsEditing,
    setShowDeleteConfirm,
    handleSave,
    handleCancelEdit,
  } = props
  if (!isEditing) {
    return (
      <>
        <button
          onClick={() => {
            setIsEditing(true)
          }}
          className="edit-btn"
        >
          Edit
        </button>
        <button
          onClick={() => {
            setShowDeleteConfirm(true)
          }}
          className="delete-btn"
        >
          Delete
        </button>
      </>
    )
  }
  return (
    <>
      <button onClick={handleCancelEdit} className="cancel-btn">
        Cancel
      </button>
      <button
        onClick={() => {
          void handleSave()
        }}
        disabled={saving || !editName.trim()}
        className="save-btn"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </>
  )
}
