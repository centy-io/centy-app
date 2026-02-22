import { useState } from 'react'

interface EnumValuesEditorProps {
  enumValues: string[]
  onAdd: (value: string) => void
  onRemove: (value: string) => void
}

export function EnumValuesEditor({
  enumValues,
  onAdd,
  onRemove,
}: EnumValuesEditorProps) {
  const [newEnumValue, setNewEnumValue] = useState('')

  const handleAddEnumValue = () => {
    const trimmed = newEnumValue.trim()
    if (!trimmed || enumValues.includes(trimmed)) return
    onAdd(trimmed)
    setNewEnumValue('')
  }

  return (
    <div className="custom-field-enum-section">
      <label className="form-label">Options</label>
      <div className="custom-field-enum-list">
        {enumValues.map(value => (
          <span key={value} className="custom-field-enum-tag">
            {value}
            <button className="custom-field-enum-remove-btn" type="button" onClick={() => onRemove(value)}>
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="custom-field-enum-add">
        <input
          type="text"
          value={newEnumValue}
          onChange={e => setNewEnumValue(e.target.value)}
          onKeyDown={e => {
            if (e.key !== 'Enter') return
            e.preventDefault()
            handleAddEnumValue()
          }}
          placeholder="Add option..."
          className="custom-field-form-input"
        />
        <button
          className="custom-field-enum-add-btn"
          type="button"
          onClick={handleAddEnumValue}
          disabled={
            !newEnumValue.trim() || enumValues.includes(newEnumValue.trim())
          }
        >
          Add
        </button>
      </div>
    </div>
  )
}
