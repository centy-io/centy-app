'use client'

interface MapAddRowProps {
  newKey: string
  newValue: string
  isKeyTaken: boolean
  onKeyChange: (v: string) => void
  onValueChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onAdd: () => void
}

export function MapAddRow({
  newKey,
  newValue,
  isKeyTaken,
  onKeyChange,
  onValueChange,
  onKeyDown,
  onAdd,
}: MapAddRowProps) {
  return (
    <div className="proto-form-add-row">
      <input
        type="text"
        className="proto-form-input proto-form-map-key-input"
        value={newKey}
        onChange={e => onKeyChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Key"
      />
      <input
        type="text"
        className="proto-form-input proto-form-map-add-value-input"
        value={newValue}
        onChange={e => onValueChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Value"
      />
      <button
        type="button"
        className="proto-form-add-btn"
        onClick={onAdd}
        disabled={!newKey.trim() || isKeyTaken}
      >
        Add
      </button>
    </div>
  )
}
