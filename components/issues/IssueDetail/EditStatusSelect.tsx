'use client'

import type { ReactElement } from 'react'
import type { IssueStateOption } from './IssueStateOption'

interface EditStatusSelectProps {
  editStatus: string
  setEditStatus: (status: string) => void
  stateOptions: IssueStateOption[]
}

export function EditStatusSelect({
  editStatus,
  setEditStatus,
  stateOptions,
}: EditStatusSelectProps): ReactElement {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="edit-status">
        Status:
      </label>
      <select
        className="form-select"
        id="edit-status"
        value={editStatus}
        onChange={e => {
          setEditStatus(e.target.value)
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
