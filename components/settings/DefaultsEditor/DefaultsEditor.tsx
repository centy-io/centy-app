'use client'

import { useState } from 'react'
import type { DefaultsEditorProps } from './DefaultsEditor.types'
import { DefaultsTable } from './DefaultsTable'
import { DefaultsAddRow } from './DefaultsAddRow'

export function DefaultsEditor({
  value,
  onChange,
  suggestedKeys = [],
}: DefaultsEditorProps) {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const entries = Object.entries(value) as [string, string][]

  const handleAdd = () => {
    if (newKey.trim() && !value[newKey.trim()]) {
      onChange({
        ...value,
        [newKey.trim()]: newValue,
      })
      setNewKey('')
      setNewValue('')
    }
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
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
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

      <DefaultsAddRow
        newKey={newKey}
        newValue={newValue}
        availableKeys={availableKeys}
        value={value}
        onNewKeyChange={setNewKey}
        onNewValueChange={setNewValue}
        onKeyDown={handleKeyDown}
        onAdd={handleAdd}
      />

      {entries.length === 0 && (
        <p className="defaults-empty">No default values configured</p>
      )}
    </div>
  )
}
