'use client'

import type { ReactElement } from 'react'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface CreateIssueFormActionsProps {
  error: string | null
  loading: boolean
  title: string
  onCancel: () => void
}

export function CreateIssueFormActions({
  error,
  loading,
  title,
  onCancel,
}: CreateIssueFormActionsProps): ReactElement {
  return (
    <>
      {error && <DaemonErrorMessage error={error} />}
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
    </>
  )
}
