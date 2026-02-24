'use client'

import type { ReactElement } from 'react'

export function IssueFormActions({
  title,
  loading,
  onCancel,
}: {
  title: string
  loading: boolean
  onCancel: () => void
}): ReactElement {
  return (
    <div className="actions">
      <button type="button" onClick={onCancel} className="secondary">
        Cancel
      </button>
      <button
        type="submit"
        disabled={!title.trim() || loading}
        className="primary"
      >
        {loading ? 'Creating...' : 'Create Issue'}
      </button>
    </div>
  )
}
