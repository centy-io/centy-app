import { ColorPicker } from '@/components/shared/ColorPicker'
import type { StateRowProps } from './StateListEditor.types'

export function StateRow({
  state,
  index,
  color,
  isDragging,
  isDefault,
  canRemove,
  onColorChange,
  onSetDefault,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
}: StateRowProps) {
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
        value={isDefault ? 'default' : ''}
        onChange={e => {
          if (e.target.value === 'default') {
            onSetDefault()
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
        disabled={!canRemove}
        className="state-remove-btn"
        title={
          isDefault
            ? 'Cannot remove default state'
            : !canRemove
              ? 'Must have at least one state'
              : 'Remove state'
        }
      >
        &times;
      </button>
    </div>
  )
}
