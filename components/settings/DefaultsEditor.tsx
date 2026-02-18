'use client'

import { useState } from 'react'

interface DefaultsEditorProps {
  value: Record<string, string>
  onChange: (defaults: Record<string, string>) => void
  suggestedKeys?: string[]
}

interface DefaultsTableProps {
  entries: [string, string][]
  onValueChange: (key: string, newVal: string) => void
  onRemove: (key: string) => void
}

function DefaultsTable({
  entries,
  onValueChange,
  onRemove,
}: DefaultsTableProps) {
  return (
    <table className="defaults-table">
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {entries.map(([key, val]) => (
          <tr key={key}>
            <td className="defaults-key">{key}</td>
            <td>
              <input
                type="text"
                value={val}
                onChange={e => onValueChange(key, e.target.value)}
                className="defaults-value-input"
              />
            </td>
            <td>
              <button
                type="button"
                onClick={() => onRemove(key)}
                className="defaults-remove-btn"
                title="Remove"
              >
                &times;
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
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
        <datalist id="suggested-keys">
          {availableKeys.map(k => (
            <option key={k} value={k} />
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
  suggestedKeys = [],
}: DefaultsEditorProps) {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const entries = Object.entries(value)

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
