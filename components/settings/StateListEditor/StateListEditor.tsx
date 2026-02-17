'use client'

import { useState } from 'react'
import { StateManager } from '@/lib/state'
import { StateRow } from './StateRow'
import { AddStateForm } from './AddStateForm'
import type { StateListEditorProps } from './StateListEditor.types'

const DEFAULT_STATE_COLORS = StateManager.getDefaultColors()

export function StateListEditor({
  states,
  stateColors,
  defaultState,
  onStatesChange,
  onColorsChange,
  onDefaultChange,
}: StateListEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const getColor = (state: string) => {
    return stateColors[state] || DEFAULT_STATE_COLORS[state] || '#888888'
  }

  const handleRemoveState = (state: string) => {
    if (states.length <= 1) return
    if (state === defaultState) return

    const newStates = states.filter(s => s !== state)
    onStatesChange(newStates)

    const newColors = { ...stateColors }
    delete newColors[state]
    onColorsChange(newColors)
  }

  const handleColorChange = (state: string, color: string) => {
    onColorsChange({
      ...stateColors,
      [state]: color,
    })
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newStates = [...states]
    const [removed] = newStates.splice(draggedIndex, 1)
    newStates.splice(index, 0, removed)
    onStatesChange(newStates)
    setDraggedIndex(index)
  }

  const handleAddState = (trimmed: string) => {
    onStatesChange([...states, trimmed])
  }

  return (
    <div className="state-list-editor">
      <div className="state-list">
        {states.map((state, index) => (
          <StateRow
            key={state}
            state={state}
            index={index}
            color={getColor(state)}
            isDragging={draggedIndex === index}
            isDefault={state === defaultState}
            canRemove={states.length > 1 && state !== defaultState}
            onColorChange={color => handleColorChange(state, color)}
            onSetDefault={() => onDefaultChange(state)}
            onRemove={() => handleRemoveState(state)}
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={e => handleDragOver(e, index)}
            onDragEnd={() => setDraggedIndex(null)}
          />
        ))}
      </div>

      <AddStateForm states={states} onAddState={handleAddState} />

      <p className="state-hint">
        Drag to reorder. The default state is used for new issues.
      </p>
    </div>
  )
}
