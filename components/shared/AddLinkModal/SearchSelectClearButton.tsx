'use client'

export function SearchSelectClearButton({ onClear }: { onClear: () => void }) {
  return (
    <button
      className="search-select-clear"
      type="button"
      aria-label="Clear selection"
      onMouseDown={e => void e.preventDefault()}
      onClick={onClear}
    >
      ×
    </button>
  )
}
