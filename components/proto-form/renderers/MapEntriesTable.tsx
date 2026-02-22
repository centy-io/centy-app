'use client'

interface MapEntriesTableProps {
  entries: [string, unknown][]
  onValueChange: (key: string, val: string) => void
  onRemove: (key: string) => void
}

export function MapEntriesTable({
  entries,
  onValueChange,
  onRemove,
}: MapEntriesTableProps) {
  return (
    <table className="proto-form-map-table">
      <thead className="proto-form-map-thead">
        <tr className="proto-form-map-header-row">
          <th className="proto-form-map-th">Key</th>
          <th className="proto-form-map-th">Value</th>
          <th className="proto-form-map-th-action" />
        </tr>
      </thead>
      <tbody className="proto-form-map-tbody">
        {entries.map(([k, v]) => (
          <tr key={k} className="proto-form-map-row">
            <td className="proto-form-map-key">{k}</td>
            <td className="proto-form-map-value-cell">
              <input
                type="text"
                className="proto-form-input proto-form-map-value-input"
                value={String(v !== null && v !== undefined ? v : '')}
                onChange={e => onValueChange(k, e.target.value)}
              />
            </td>
            <td className="proto-form-map-action-cell">
              <button
                type="button"
                className="proto-form-remove-btn"
                onClick={() => onRemove(k)}
                aria-label={`Remove ${k}`}
              >
                ×
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
