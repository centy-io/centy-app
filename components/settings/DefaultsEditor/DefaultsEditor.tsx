/* eslint-disable max-lines */
'use client'

import { useState } from 'react'
import { DefaultsTable } from './DefaultsTable'

interface DefaultsEditorProps {
  value: Record<string, string>
  onChange: (defaults: Record<string, string>) => void
  suggestedKeys?: string[]
}

interface AddDefaultRowProps {
  newKey: string
  newValue: string
  availableKeys: string[]
  hasExistingKey: boolean
  onKeyChange: (key: string) => void
  onValueChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onAdd: () => void
}

function AddDefaultRow({
  newKey,
  newValue,
  availableKeys,
  hasExistingKey,
  onKeyChange,
  onValueChange,
  onKeyDown,
  onAdd,
}: AddDefaultRowProps) {
  return (
    <div className="defaults-add-row">
      <input
        type="text"
        value={newKey}
        onChange={e => onKeyChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Key"
        className="defaults-key-input"
        list="suggested-keys"
      />
      {availableKeys.length > 0 && (
        <datalist className="defaults-suggested-keys" id="suggested-keys">
          {availableKeys.map(k => (
            <option className="defaults-suggested-option" key={k} value={k} />
          ))}
        </datalist>
      )}
      <input
        type="text"
        value={newValue}
        onChange={e => onValueChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Value"
        className="defaults-value-input"
      />
      <button
        type="button"
        onClick={onAdd}
        disabled={!newKey.trim() || hasExistingKey}
        className="defaults-add-btn"
      >
        Add
      </button>
    </div>
  )
}

export function DefaultsEditor({
  value,
  onChange,
  suggestedKeys,
}: DefaultsEditorProps) {
  const resolvedSuggestedKeys = suggestedKeys !== undefined ? suggestedKeys : []
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
    // eslint-disable-next-line security/detect-object-injection
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

  // eslint-disable-next-line security/detect-object-injection
  const availableKeys = resolvedSuggestedKeys.filter(k => !value[k])

  return (
    <div className="defaults-editor">
      {entries.length > 0 && (
        <DefaultsTable
          entries={entries}
          onValueChange={handleValueChange}
          onRemove={handleRemove}
        />
      )}

      <AddDefaultRow
        newKey={newKey}
        newValue={newValue}
        availableKeys={availableKeys}
        hasExistingKey={!!value[newKey.trim()]}
        onKeyChange={setNewKey}
        onValueChange={setNewValue}
        onKeyDown={handleKeyDown}
        onAdd={handleAdd}
      />

      {entries.length === 0 && (
        <p className="defaults-empty">No default values configured</p>
      )}
    </div>
  )
}
