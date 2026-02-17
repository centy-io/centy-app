interface CustomFieldFormActionsProps {
  isEditing: boolean
  isValid: boolean
  onSave: () => void
  onCancel: () => void
}

export function CustomFieldFormActions({
  isEditing,
  isValid,
  onSave,
  onCancel,
}: CustomFieldFormActionsProps) {
  return (
    <div className="custom-field-form-actions">
      <button type="button" onClick={onCancel} className="secondary">
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={!isValid}
        className="primary"
      >
        {isEditing ? 'Update' : 'Add'} Field
      </button>
    </div>
  )
}
