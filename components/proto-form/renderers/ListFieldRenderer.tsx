'use client'

import { useState } from 'react'
import type { FieldRenderProps } from '@/lib/proto-form/types'

type ListFieldProps = Omit<FieldRenderProps, 'field'>

export function ListFieldRenderer({
  label,
  description,
  value,
  onChange,
}: ListFieldProps) {
  const rawItems = value !== null && value !== undefined ? value : []
  const items = Array.isArray(rawItems) ? rawItems : []
  const [newItem, setNewItem] = useState('')

  const handleAdd = () => {
    if (!newItem.trim()) return
    onChange([...items, newItem.trim()])
    setNewItem('')
  }

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
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

      {items.length > 0 && (
        <div className="proto-form-tags">
          {items.map((item, i) => (
            <span key={i} className="proto-form-tag">
              {String(item)}
              <button
                type="button"
                className="proto-form-tag-remove"
                onClick={() => handleRemove(i)}
                aria-label={`Remove ${String(item)}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="proto-form-add-row">
        <input
          type="text"
          className="proto-form-input"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Add ${label.toLowerCase()} item`}
        />
        <button
          type="button"
          className="proto-form-add-btn"
          onClick={handleAdd}
          disabled={!newItem.trim()}
        >
          Add
        </button>
      </div>

      {items.length === 0 && (
        <p className="proto-form-empty">No items</p>
      )}
    </div>
  )
}
