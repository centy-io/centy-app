'use client'

import type { ReactElement } from 'react'
import { StateItem } from './StateItem'
import { AddStateRow } from './AddStateRow'
import { useStateListHandlers } from './useStateListHandlers'

interface StateListEditorProps {
  states: string[]
  stateColors: Record<string, string>
  defaultState: string
  onStatesChange: (states: string[]) => void
  onColorsChange: (colors: Record<string, string>) => void
  onDefaultChange: (defaultState: string) => void
}

export function StateListEditor({
  states,
  stateColors,
  defaultState,
  onStatesChange,
  onColorsChange,
  onDefaultChange,
}: StateListEditorProps): ReactElement {
  const {
    newState,
    setNewState,
    draggedIndex,
    setDraggedIndex,
    getColor,
    handleAddState,
    handleRemoveState,
    handleColorChange,
    handleDragOver,
    handleKeyDown,
    isAddDisabled,
  } = useStateListHandlers(
    states,
    stateColors,
    defaultState,
    onStatesChange,
    onColorsChange
  )

  return (
    <div className="state-list-editor">
      <div className="state-list">
        {states.map((state, index) => (
          <StateItem
            key={state}
            state={state}
            color={getColor(state)}
            defaultState={defaultState}
            index={index}
            totalStates={states.length}
            isDragging={draggedIndex === index}
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={e => handleDragOver(e, index)}
            onDragEnd={() => setDraggedIndex(null)}
            onColorChange={color => handleColorChange(state, color)}
            onDefaultChange={onDefaultChange}
            onRemove={() => handleRemoveState(state)}
          />
        ))}
      </div>
      <AddStateRow
        newState={newState}
        isAddDisabled={isAddDisabled}
        onChange={setNewState}
        onKeyDown={handleKeyDown}
        onAdd={handleAddState}
      />
      <p className="state-hint">
        Drag to reorder. The default state is used for new issues.
      </p>
    </div>
  )
}
