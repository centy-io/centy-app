import { FIELD_TYPES } from './constants'

interface CustomFieldFormFieldsProps {
  name: string
  fieldType: string
  required: boolean
  onNameChange: (name: string) => void
  onFieldTypeChange: (fieldType: string) => void
  onRequiredChange: (required: boolean) => void
}

export function CustomFieldFormFields({
  name,
  fieldType,
  required,
  onNameChange,
  onFieldTypeChange,
  onRequiredChange,
}: CustomFieldFormFieldsProps) {
  return (
    <div className="custom-field-form-row">
      <div className="custom-field-form-group">
        <label className="form-label">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => onNameChange(e.target.value)}
          placeholder="field_name"
          className="custom-field-form-input"
        />
      </div>

      <div className="custom-field-form-group">
        <label className="form-label">Type</label>
        <select
          value={fieldType}
          onChange={e => onFieldTypeChange(e.target.value)}
          className="custom-field-form-select"
        >
          {FIELD_TYPES.map(t => (
            <option className="form-option" key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="custom-field-form-group custom-field-form-checkbox">
        <label className="form-label">
          <input
            className="form-checkbox"
            type="checkbox"
            checked={required}
            onChange={e => onRequiredChange(e.target.checked)}
          />
          Required
        </label>
      </div>
    </div>
  )
}
