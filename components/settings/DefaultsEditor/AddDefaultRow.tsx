interface AddDefaultRowProps {
  newKey: string
  newValue: string
  availableKeys: string[]
  hasExistingKey: boolean
  onKeyChange: (key: string) => void
  onValueChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onAdd: () => void
}

export function AddDefaultRow({
  newKey,
  newValue,
  availableKeys,
  hasExistingKey,
  onKeyChange,
  onValueChange,
  onKeyDown,
  onAdd,
}: AddDefaultRowProps) {
  return (
    <div className="defaults-add-row">
      <input
        type="text"
        value={newKey}
        onChange={e => onKeyChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Key"
        className="defaults-key-input"
        list="suggested-keys"
      />
      {availableKeys.length > 0 && (
        <datalist className="defaults-suggested-keys" id="suggested-keys">
          {availableKeys.map(k => (
            <option className="defaults-suggested-option" key={k} value={k} />
          ))}
        </datalist>
      )}
      <input
        type="text"
        value={newValue}
        onChange={e => onValueChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Value"
        className="defaults-value-input"
      />
      <button
        type="button"
        onClick={onAdd}
        disabled={!newKey.trim() || hasExistingKey}
        className="defaults-add-btn"
      >
        Add
      </button>
    </div>
  )
}
