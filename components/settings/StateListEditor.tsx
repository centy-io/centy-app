'use client'

import { useState } from 'react'
import { ColorPicker } from '@/components/shared/ColorPicker'
import { StateManager } from '@/lib/state'

interface StateListEditorProps {
  states: string[]
  stateColors: Record<string, string>
  defaultState: string
  onStatesChange: (states: string[]) => void
  onColorsChange: (colors: Record<string, string>) => void
  onDefaultChange: (defaultState: string) => void
}

const DEFAULT_STATE_COLORS = StateManager.getDefaultColors()

interface StateItemProps {
  state: string
  index: number
  draggedIndex: number | null
  color: string
  defaultState: string
  statesLength: number
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  onColorChange: (state: string, color: string) => void
  onDefaultChange: (state: string) => void
  onRemove: (state: string) => void
}

function StateItem({
  state,
  index,
  draggedIndex,
  color,
  defaultState,
  statesLength,
  onDragStart,
  onDragOver,
  onDragEnd,
  onColorChange,
  onDefaultChange,
  onRemove,
}: StateItemProps) {
  return (
    <div
      className={`state-item ${draggedIndex === index ? 'dragging' : ''}`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={e => onDragOver(e, index)}
      onDragEnd={onDragEnd}
    >
      <div className="state-drag-handle" title="Drag to reorder">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="state-preview" style={{ backgroundColor: color }}>
        {state}
      </div>

      <ColorPicker value={color} onChange={c => onColorChange(state, c)} />

      <select
        value={state === defaultState ? 'default' : ''}
        onChange={e => {
          if (e.target.value === 'default') {
            onDefaultChange(state)
          }
        }}
        className="state-default-select"
      >
        <option value="">-</option>
        <option value="default">Default</option>
      </select>

      <button
        type="button"
        onClick={() => onRemove(state)}
        disabled={statesLength <= 1 || state === defaultState}
        className="state-remove-btn"
        title={
          state === defaultState
            ? 'Cannot remove default state'
            : statesLength <= 1
              ? 'Must have at least one state'
              : 'Remove state'
        }
      >
        &times;
      </button>
    </div>
  )
}

function AddStateRow({
  newState,
  setNewState,
  onAdd,
  states,
}: {
  newState: string
  setNewState: (v: string) => void
  onAdd: () => void
  states: string[]
}) {
  return (
    <div className="state-add-row">
      <input
        type="text"
        value={newState}
        onChange={e => setNewState(e.target.value)}
        onKeyDown={e => {
          if (e.key !== 'Enter') return
          e.preventDefault()
          onAdd()
        }}
        placeholder="New state name..."
        className="state-add-input"
      />
      <button
        type="button"
        onClick={onAdd}
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

function getColor(stateColors: Record<string, string>, state: string) {
  return stateColors[state] || DEFAULT_STATE_COLORS[state] || '#888888'
}

export function StateListEditor({
  states,
  stateColors,
  defaultState,
  onStatesChange,
  onColorsChange,
  onDefaultChange,
}: StateListEditorProps) {
  const [newState, setNewState] = useState('')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleAddState = () => {
    const trimmed = newState.trim().toLowerCase().replace(/\s+/g, '-')
    if (!trimmed || states.includes(trimmed)) return
    onStatesChange([...states, trimmed])
    setNewState('')
  }

  const handleRemoveState = (state: string) => {
    if (states.length <= 1 || state === defaultState) return
    onStatesChange(states.filter(s => s !== state))
    const newColors = { ...stateColors }
    delete newColors[state]
    onColorsChange(newColors)
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

  return (
    <div className="state-list-editor">
      <div className="state-list">
        {states.map((state, index) => (
          <StateItem
            key={state}
            state={state}
            index={index}
            draggedIndex={draggedIndex}
            color={getColor(stateColors, state)}
            defaultState={defaultState}
            statesLength={states.length}
            onDragStart={setDraggedIndex}
            onDragOver={handleDragOver}
            onDragEnd={() => setDraggedIndex(null)}
            onColorChange={(s, c) => onColorsChange({ ...stateColors, [s]: c })}
            onDefaultChange={onDefaultChange}
            onRemove={handleRemoveState}
          />
        ))}
      </div>

      <AddStateRow
        newState={newState}
        setNewState={setNewState}
        onAdd={handleAddState}
        states={states}
      />

      <p className="state-hint">
        Drag to reorder. The default state is used for new issues.
      </p>
    </div>
  )
}
