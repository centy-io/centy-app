'use client'

import { useState } from 'react'
import { MapEntriesTable } from './MapEntriesTable'
import { MapAddRow } from './MapAddRow'
import type { FieldRenderProps } from '@/lib/proto-form/types'

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
