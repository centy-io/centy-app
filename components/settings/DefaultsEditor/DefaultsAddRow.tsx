import type { DefaultsAddRowProps } from './DefaultsEditor.types'

export function DefaultsAddRow({
  newKey,
  newValue,
  availableKeys,
  value,
  onNewKeyChange,
  onNewValueChange,
  onKeyDown,
  onAdd,
}: DefaultsAddRowProps) {
  return (
    <div className="defaults-add-row">
      <input
        type="text"
        value={newKey}
        onChange={e => onNewKeyChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Key"
        className="defaults-key-input"
        list="suggested-keys"
      />
      {availableKeys.length > 0 && (
        <datalist id="suggested-keys">
          {availableKeys.map(k => (
            <option key={k} value={k} />
          ))}
        </datalist>
      )}
      <input
        type="text"
        value={newValue}
        onChange={e => onNewValueChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Value"
        className="defaults-value-input"
      />
      <button
        type="button"
        onClick={onAdd}
        disabled={!newKey.trim() || !!value[newKey.trim()]}
        className="defaults-add-btn"
      >
        Add
      </button>
    </div>
  )
}
