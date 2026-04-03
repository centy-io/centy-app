function toLabel(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
}

interface CustomFieldEditorProps {
  fieldName: string
  value: string
  onChange: (value: string) => void
}

export function CustomFieldEditor({
  fieldName,
  value,
  onChange,
}: CustomFieldEditorProps): React.JSX.Element {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={`edit-field-${fieldName}`}>
        {toLabel(fieldName)}:
      </label>
      <textarea
        className="form-input"
        id={`edit-field-${fieldName}`}
        value={value}
        rows={3}
        onChange={e => {
          onChange(e.target.value)
        }}
      />
    </div>
  )
}
