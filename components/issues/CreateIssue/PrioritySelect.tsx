'use client'

import type { ReactElement } from 'react'

interface PrioritySelectProps {
  priority: number
  setPriority: (priority: number) => void
}

export function PrioritySelect({
  priority,
  setPriority,
}: PrioritySelectProps): ReactElement {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="priority">
        Priority:
      </label>
      <select
        className="form-select"
        id="priority"
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
