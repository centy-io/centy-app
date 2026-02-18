interface DefaultsTableProps {
  entries: [string, string][]
  onValueChange: (key: string, newVal: string) => void
  onRemove: (key: string) => void
}

export function DefaultsTable({
  entries,
  onValueChange,
  onRemove,
}: DefaultsTableProps) {
  return (
    <table className="defaults-table">
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {entries.map(([key, val]) => (
          <tr key={key}>
            <td className="defaults-key">{key}</td>
            <td>
              <input
                type="text"
                value={val}
                onChange={e => onValueChange(key, e.target.value)}
                className="defaults-value-input"
              />
            </td>
            <td>
              <button
                type="button"
                onClick={() => onRemove(key)}
                className="defaults-remove-btn"
                title="Remove"
              >
                &times;
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
