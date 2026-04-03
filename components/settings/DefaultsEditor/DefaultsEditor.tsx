'use client'

import { useState } from 'react'
import { DefaultsTable } from './DefaultsTable'
import { AddDefaultRow } from './AddDefaultRow'

interface DefaultsEditorProps {
  value: Record<string, string>
  onChange: (defaults: Record<string, string>) => void
  suggestedKeys?: string[]
}

export function DefaultsEditor({
  value,
  onChange,
  suggestedKeys,
}: DefaultsEditorProps) {
  const resolvedSuggestedKeys = suggestedKeys ?? []
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
    const { [key]: _removed, ...rest } = value
    onChange(rest)
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

  const availableKeys = resolvedSuggestedKeys.filter(
    k => !Object.hasOwn(value, k)
  )

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
