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
      <thead className="defaults-thead">
        <tr className="defaults-header-row">
          <th className="defaults-header-cell">Key</th>
          <th className="defaults-header-cell">Value</th>
          <th className="defaults-header-cell"></th>
        </tr>
      </thead>
      <tbody className="defaults-tbody">
        {entries.map(([key, val]) => (
          <tr className="defaults-row" key={key}>
            <td className="defaults-key">{key}</td>
            <td className="defaults-value-cell">
              <input
                type="text"
                value={val}
                onChange={e => onValueChange(key, e.target.value)}
                className="defaults-value-input"
              />
            </td>
            <td className="defaults-action-cell">
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
