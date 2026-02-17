'use client'

import { useState } from 'react'

interface EnumValuesEditorProps {
  enumValues: string[]
  onEnumValuesChange: (values: string[]) => void
  onDefaultCleared: () => void
  defaultValue: string
}

export function EnumValuesEditor({
  enumValues,
  onEnumValuesChange,
  onDefaultCleared,
  defaultValue,
}: EnumValuesEditorProps) {
  const [newEnumValue, setNewEnumValue] = useState('')

  const handleAddEnumValue = () => {
    const trimmed = newEnumValue.trim()
    if (trimmed && !enumValues.includes(trimmed)) {
      onEnumValuesChange([...enumValues, trimmed])
      setNewEnumValue('')
    }
  }

  const handleRemoveEnumValue = (value: string) => {
    onEnumValuesChange(enumValues.filter(v => v !== value))
    if (defaultValue === value) {
      onDefaultCleared()
    }
  }

  return (
    <div className="custom-field-enum-section">
      <label>Options</label>
      <div className="custom-field-enum-list">
        {enumValues.map(value => (
          <span key={value} className="custom-field-enum-tag">
            {value}
            <button type="button" onClick={() => handleRemoveEnumValue(value)}>
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
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAddEnumValue()
            }
          }}
          placeholder="Add option..."
          className="custom-field-form-input"
        />
        <button
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
