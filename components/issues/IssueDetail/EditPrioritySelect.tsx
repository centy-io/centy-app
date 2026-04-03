'use client'

import type { ReactElement } from 'react'

interface EditPrioritySelectProps {
  editPriority: number
  setEditPriority: (priority: number) => void
}

export function EditPrioritySelect({
  editPriority,
  setEditPriority,
}: EditPrioritySelectProps): ReactElement {
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
