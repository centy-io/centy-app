import { TTL_OPTIONS } from './TTL_OPTIONS'

interface TtlSelectProps {
  ttlHours: number
  setTtlHours: (v: number) => void
}

export function TtlSelect({ ttlHours, setTtlHours }: TtlSelectProps) {
  return (
    <div className="standalone-modal-field">
      <label className="standalone-modal-label" htmlFor="workspace-ttl">
        Workspace Duration
      </label>
      <select
        id="workspace-ttl"
        value={ttlHours}
        onChange={e => {
          setTtlHours(Number(e.target.value))
        }}
        className="standalone-modal-select"
      >
        {TTL_OPTIONS.map(option => (
          <option
            className="standalone-modal-option"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
