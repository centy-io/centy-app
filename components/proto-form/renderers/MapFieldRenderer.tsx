/* eslint-disable max-lines */
'use client'

import { useState } from 'react'
import { MapEntriesTable } from './MapEntriesTable'
import type { FieldRenderProps } from '@/lib/proto-form/FieldRenderProps'

interface MapFieldProps extends Omit<FieldRenderProps, 'field'> {
  label: string
  description?: string
}

function toMap(v: unknown): Record<string, unknown> {
  if (
    v !== null &&
    v !== undefined &&
    typeof v === 'object' &&
    !Array.isArray(v)
  ) {
    const result: Record<string, unknown> = {}
    Object.assign(result, v)
    return result
  }
  return {}
}

interface MapAddRowProps {
  newKey: string
  newValue: string
  isKeyTaken: boolean
  onKeyChange: (v: string) => void
  onValueChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onAdd: () => void
}

function MapAddRow({
  newKey,
  newValue,
  isKeyTaken,
  onKeyChange,
  onValueChange,
  onKeyDown,
  onAdd,
}: MapAddRowProps) {
  return (
    <div className="proto-form-add-row">
      <input
        type="text"
        className="proto-form-input proto-form-map-key-input"
        value={newKey}
        onChange={e => onKeyChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Key"
      />
      <input
        type="text"
        className="proto-form-input proto-form-map-add-value-input"
        value={newValue}
        onChange={e => onValueChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Value"
      />
      <button
        type="button"
        className="proto-form-add-btn"
        onClick={onAdd}
        disabled={!newKey.trim() || isKeyTaken}
      >
        Add
      </button>
    </div>
  )
}

export function MapFieldRenderer({
  label,
  description,
  value,
  onChange,
}: MapFieldProps) {
  const map = toMap(value)
  const entries = Object.entries(map)
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const handleAdd = () => {
    if (!newKey.trim() || map[newKey.trim()] !== undefined) return
    onChange({ ...map, [newKey.trim()]: newValue })
    setNewKey('')
    setNewValue('')
  }

  const handleRemove = (key: string) => {
    const next = { ...map }
    // eslint-disable-next-line security/detect-object-injection
    delete next[key]
    onChange(next)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    handleAdd()
  }

  return (
    <div className="proto-form-field">
      <label className="proto-form-field-label">{label}</label>
      {description && (
        <p className="proto-form-field-description">{description}</p>
      )}
      {entries.length > 0 && (
        <MapEntriesTable
          entries={entries}
          onValueChange={(k, v) => onChange({ ...map, [k]: v })}
          onRemove={handleRemove}
        />
      )}
      <MapAddRow
        newKey={newKey}
        newValue={newValue}
        isKeyTaken={map[newKey.trim()] !== undefined}
        onKeyChange={setNewKey}
        onValueChange={setNewValue}
        onKeyDown={handleKeyDown}
        onAdd={handleAdd}
      />
      {entries.length === 0 && <p className="proto-form-empty">No entries</p>}
    </div>
  )
}
