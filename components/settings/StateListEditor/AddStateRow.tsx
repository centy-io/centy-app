import type { KeyboardEvent } from 'react'

interface AddStateRowProps {
  newState: string
  isAddDisabled: boolean
  onChange: (value: string) => void
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  onAdd: () => void
}

export function AddStateRow({
  newState,
  isAddDisabled,
  onChange,
  onKeyDown,
  onAdd,
}: AddStateRowProps) {
  return (
    <div className="state-add-row">
      <input
        type="text"
        value={newState}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="New state name..."
        className="state-add-input"
      />
      <button
        type="button"
        onClick={onAdd}
        disabled={isAddDisabled}
        className="state-add-btn"
      >
        + Add State
      </button>
    </div>
  )
}
