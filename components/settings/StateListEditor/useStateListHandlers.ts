import { useState } from 'react'
import { StateManager } from '@/lib/state'

const DEFAULT_STATE_COLORS = StateManager.getDefaultColors()

export function useStateListHandlers(
  states: string[],
  stateColors: Record<string, string>,
  defaultState: string,
  onStatesChange: (states: string[]) => void,
  onColorsChange: (colors: Record<string, string>) => void
) {
  const [newState, setNewState] = useState('')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const getColor = (state: string) => {
    // eslint-disable-next-line security/detect-object-injection
    return stateColors[state] || DEFAULT_STATE_COLORS[state] || '#888888'
  }

  const handleAddState = () => {
    const trimmed = newState.trim().toLowerCase().replace(/\s+/g, '-')
    if (!trimmed || states.includes(trimmed)) return
    onStatesChange([...states, trimmed])
    setNewState('')
  }

  const handleRemoveState = (state: string) => {
    if (states.length <= 1) return
    if (state === defaultState) return
    const newStates = states.filter(s => s !== state)
    onStatesChange(newStates)
    const newColors = { ...stateColors }
    // eslint-disable-next-line security/detect-object-injection
    delete newColors[state]
    onColorsChange(newColors)
  }

  const handleColorChange = (state: string, color: string) => {
    onColorsChange({ ...stateColors, [state]: color })
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    handleAddState()
  }

  const isAddDisabled =
    !newState.trim() ||
    states.includes(newState.trim().toLowerCase().replace(/\s+/g, '-'))

  return {
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
  }
}
