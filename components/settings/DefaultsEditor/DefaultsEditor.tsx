'use client'

import { useState } from 'react'
import { DefaultsTable } from './DefaultsTable'

interface DefaultsEditorProps {
  value: Record<string, string>
  onChange: (defaults: Record<string, string>) => void
  suggestedKeys?: string[]
}

export function DefaultsEditor({
  value,
  onChange,
  suggestedKeys = [],
}: DefaultsEditorProps) {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const entries: [string, string][] = Object.entries(value)

  const handleAdd = () => {
    if (!newKey.trim() || value[newKey.trim()]) return
    onChange({
      ...value,
      [newKey.trim()]: newValue,
    })
    setNewKey('')
    setNewValue('')
  }

  const handleRemove = (key: string) => {
    const newDefaults = { ...value }
    delete newDefaults[key]
    onChange(newDefaults)
  }

  const handleValueChange = (key: string, newVal: string) => {
    onChange({
      ...value,
      [key]: newVal,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    handleAdd()
  }

  const availableKeys = suggestedKeys.filter(k => !value[k])

  return (
    <div className="defaults-editor">
      {entries.length > 0 && (
        <DefaultsTable
          entries={entries}
          onValueChange={handleValueChange}
          onRemove={handleRemove}
        />
      )}

      <div className="defaults-add-row">
        <input
          type="text"
          value={newKey}
          onChange={e => setNewKey(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Key"
          className="defaults-key-input"
          list="suggested-keys"
        />
        {availableKeys.length > 0 && (
          <datalist id="suggested-keys">
            {availableKeys.map(k => (
              <option key={k} value={k} />
            ))}
          </datalist>
        )}
        <input
          type="text"
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Value"
          className="defaults-value-input"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newKey.trim() || !!value[newKey.trim()]}
          className="defaults-add-btn"
        >
          Add
        </button>
      </div>

      {entries.length === 0 && (
        <p className="defaults-empty">No default values configured</p>
      )}
    </div>
  )
}
