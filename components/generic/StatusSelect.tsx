interface StatusSelectProps {
  statuses: string[]
  status: string
  setStatus: (v: string) => void
}

export function StatusSelect({
  statuses,
  status,
  setStatus,
}: StatusSelectProps) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="status">
        Status:
      </label>
      <select
        className="form-input"
        id="status"
        value={status}
        onChange={e => {
          setStatus(e.target.value)
        }}
      >
        {statuses.map(s => (
          <option key={s} value={s} className="form-option">
            {s}
          </option>
        ))}
      </select>
    </div>
  )
}
