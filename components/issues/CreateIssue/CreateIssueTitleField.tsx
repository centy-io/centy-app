'use client'

import type { ReactElement } from 'react'

interface CreateIssueTitleFieldProps {
  title: string
  setTitle: (v: string) => void
}

export function CreateIssueTitleField({
  title,
  setTitle,
}: CreateIssueTitleFieldProps): ReactElement {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="title">
        Title:
      </label>
      <input
        className="form-input"
        id="title"
        type="text"
        value={title}
        onChange={e => {
          setTitle(e.target.value)
        }}
        placeholder="Issue title"
        required
      />
    </div>
  )
}
