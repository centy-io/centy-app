'use client'

import type { ReactElement } from 'react'
import type { StateOption } from './StateOption'

interface StatusSelectProps {
  status: string
  setStatus: (status: string) => void
  stateOptions: StateOption[]
}

export function StatusSelect({
  status,
  setStatus,
  stateOptions,
}: StatusSelectProps): ReactElement {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="status">
        Status:
      </label>
      <select
        className="form-select"
        id="status"
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
