import { ColorPicker } from '@/components/shared/ColorPicker'

interface StateItemProps {
  state: string
  color: string
  defaultState: string
  index: number
  totalStates: number
  isDragging: boolean
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragEnd: () => void
  onColorChange: (color: string) => void
  onDefaultChange: (state: string) => void
  onRemove: () => void
}

export function StateItem({
  state,
  color,
  defaultState,
  index,
  totalStates,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
  onColorChange,
  onDefaultChange,
  onRemove,
}: StateItemProps) {
  return (
    <div
      className={`state-item ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
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

      <ColorPicker value={color} onChange={onColorChange} />

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
        onClick={onRemove}
        disabled={totalStates <= 1 || state === defaultState}
        className="state-remove-btn"
        title={
          state === defaultState
            ? 'Cannot remove default state'
            : totalStates <= 1
              ? 'Must have at least one state'
              : 'Remove state'
        }
      >
        &times;
      </button>
    </div>
  )
}
