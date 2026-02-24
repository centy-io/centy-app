'use client'

import type { ReactElement } from 'react'
import type { IssueStateOption } from './IssueStateOption'

export function EditStatusSelect({
  editStatus,
  setEditStatus,
  stateOptions,
}: {
  editStatus: string
  setEditStatus: (s: string) => void
  stateOptions: IssueStateOption[]
}): ReactElement {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="edit-status">
        Status:
      </label>
      <select
        className="form-select"
        id="edit-status"
        value={editStatus}
        onChange={e => setEditStatus(e.target.value)}
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

export function EditPrioritySelect({
  editPriority,
  setEditPriority,
}: {
  editPriority: number
  setEditPriority: (p: number) => void
}): ReactElement {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="edit-priority">
        Priority:
      </label>
      <select
        className="form-select"
        id="edit-priority"
        value={editPriority}
        onChange={e => setEditPriority(Number(e.target.value))}
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
