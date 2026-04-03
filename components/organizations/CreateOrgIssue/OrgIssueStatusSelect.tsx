'use client'

interface OrgIssueStatusSelectProps {
  status: string
  setStatus: (v: string) => void
  stateOptions: { value: string; label: string }[]
}

export function OrgIssueStatusSelect({
  status,
  setStatus,
  stateOptions,
}: OrgIssueStatusSelectProps) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="org-issue-status">
        Status:
      </label>
      <select
        className="form-select"
        id="org-issue-status"
        value={status}
        onChange={e => {
          setStatus(e.target.value)
        }}
      >
        {stateOptions.map(option => (
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
