'use client'

interface OrgIssuePrioritySelectProps {
  priority: number
  setPriority: (v: number) => void
}

export function OrgIssuePrioritySelect({
  priority,
  setPriority,
}: OrgIssuePrioritySelectProps) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="org-issue-priority">
        Priority:
      </label>
      <select
        className="form-select"
        id="org-issue-priority"
        value={priority}
        onChange={e => {
          setPriority(Number(e.target.value))
        }}
      >
        <option className="form-option" value={1}>
          High
        </option>
        <option className="form-option" value={2}>
          Medium
        </option>
        <option className="form-option" value={3}>
          Low
        </option>
      </select>
    </div>
  )
}
