'use client'

const PRIORITY_OPTIONS = [
  { value: 1, label: 'High' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Low' },
]

interface PrioritySelectProps {
  value: number
  onChange: (v: number) => void
}

export function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="org-issue-priority">
        Priority:
      </label>
      <select
        className="form-select"
        id="org-issue-priority"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      >
        {PRIORITY_OPTIONS.map(opt => (
          <option key={opt.value} className="form-option" value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
