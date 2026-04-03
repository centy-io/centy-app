'use client'

interface StatusSelectProps {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}

export function StatusSelect({ value, onChange, options }: StatusSelectProps) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="org-issue-status">
        Status:
      </label>
      <select
        className="form-select"
        id="org-issue-status"
        value={value}
        onChange={e => {
          onChange(e.target.value)
        }}
      >
        {options.map(option => (
          <option
            className="form-option"
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
