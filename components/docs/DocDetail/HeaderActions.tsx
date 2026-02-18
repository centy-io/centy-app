interface HeaderActionsProps {
  isEditing: boolean
  saving: boolean
  onEdit: () => void
  onMove: () => void
  onDuplicate: () => void
  onDelete: () => void
  onCancel: () => void
  onSave: () => void
}

export function HeaderActions({
  isEditing,
  saving,
  onEdit,
  onMove,
  onDuplicate,
  onDelete,
  onCancel,
  onSave,
}: HeaderActionsProps) {
  if (isEditing) {
    return (
      <div className="doc-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button onClick={onSave} disabled={saving} className="save-btn">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    )
  }

  return (
    <div className="doc-actions">
      <button onClick={onEdit} className="edit-btn">
        Edit
      </button>
      <button onClick={onMove} className="move-btn">
        Move
      </button>
      <button onClick={onDuplicate} className="duplicate-btn">
        Duplicate
      </button>
      <button onClick={onDelete} className="delete-btn">
        Delete
      </button>
    </div>
  )
}
