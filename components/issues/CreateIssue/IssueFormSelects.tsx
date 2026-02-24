'use client'

import type { ReactElement } from 'react'
import type { StateOption } from './StateOption'

export function PrioritySelect({
  priority,
  setPriority,
}: {
  priority: number
  setPriority: (p: number) => void
}): ReactElement {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="priority">
        Priority:
      </label>
      <select
        className="form-select"
        id="priority"
        value={priority}
        onChange={e => setPriority(Number(e.target.value))}
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

export function StatusSelect({
  status,
  setStatus,
  stateOptions,
}: {
  status: string
  setStatus: (s: string) => void
  stateOptions: StateOption[]
}): ReactElement {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="status">
        Status:
      </label>
      <select
        className="form-select"
        id="status"
        value={status}
        onChange={e => setStatus(e.target.value)}
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
