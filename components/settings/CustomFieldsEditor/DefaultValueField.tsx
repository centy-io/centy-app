interface DefaultValueFieldProps {
  fieldType: string
  defaultValue: string
  enumValues: string[]
  onDefaultValueChange: (value: string) => void
}

export function DefaultValueField({
  fieldType,
  defaultValue,
  enumValues,
  onDefaultValueChange,
}: DefaultValueFieldProps) {
  return (
    <div className="custom-field-form-group">
      <label>Default Value</label>
      {fieldType === 'enum' ? (
        <select
          value={defaultValue}
          onChange={e => onDefaultValueChange(e.target.value)}
          className="custom-field-form-select"
        >
          <option value="">No default</option>
          {enumValues.map(v => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      ) : fieldType === 'boolean' ? (
        <select
          value={defaultValue}
          onChange={e => onDefaultValueChange(e.target.value)}
          className="custom-field-form-select"
        >
          <option value="">No default</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      ) : (
        <input
          type={fieldType === 'number' ? 'number' : 'text'}
          value={defaultValue}
          onChange={e => onDefaultValueChange(e.target.value)}
          placeholder={fieldType === 'number' ? '0' : 'Default value...'}
          className="custom-field-form-input"
        />
      )}
    </div>
  )
}
