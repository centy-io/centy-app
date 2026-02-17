'use client'

import { useState } from 'react'
import type { AddStateFormProps } from './StateListEditor.types'

export function AddStateForm({ states, onAddState }: AddStateFormProps) {
  const [newState, setNewState] = useState('')

  const handleAddState = () => {
    const trimmed = newState.trim().toLowerCase().replace(/\s+/g, '-')
    if (trimmed && !states.includes(trimmed)) {
      onAddState(trimmed)
      setNewState('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddState()
    }
  }

  return (
    <div className="state-add-row">
      <input
        type="text"
        value={newState}
        onChange={e => setNewState(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="New state name..."
        className="state-add-input"
      />
      <button
        type="button"
        onClick={handleAddState}
        disabled={
          !newState.trim() ||
          states.includes(newState.trim().toLowerCase().replace(/\s+/g, '-'))
        }
        className="state-add-btn"
      >
        + Add State
      </button>
    </div>
  )
}
