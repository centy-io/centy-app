'use client'

import { useCallback, useMemo } from 'react'
import { useProjectUsers } from './useProjectUsers'
import {
  MultiSelect,
  type MultiSelectOption,
} from '@/components/shared/MultiSelect'

interface AssigneeSelectorProps {
  projectPath: string
  issueId: string
  currentAssignees: string[]
  onAssigneesChange: (assignees: string[]) => void
  disabled?: boolean
}

export function AssigneeSelector({
  projectPath,
  currentAssignees,
}: AssigneeSelectorProps) {
  const { users, loading, error, setError, fetchUsers } =
    useProjectUsers(projectPath)

  const options: MultiSelectOption[] = useMemo(
    () =>
      users.map(user => ({
        value: user.id,
        label: user.name,
      })),
    [users]
  )

  const handleChange = useCallback(async () => {
    setError('Assignee modification not yet implemented')
  }, [setError])

  if (loading) {
    return (
      <div className="assignee-selector loading">
        <span className="loading-text">Loading users...</span>
      </div>
    )
  }

  if (error) {
    const isUnimplemented =
      error.includes('not available') || error.includes('not yet implemented')
    return (
      <div className="assignee-selector error">
        <span className="error-text">{error}</span>
        {!isUnimplemented && (
          <button
            onClick={() => {
              void fetchUsers()
            }}
            className="retry-btn"
          >
            Retry
          </button>
        )}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="assignee-selector empty">
        <span className="empty-text">No users in project</span>
      </div>
    )
  }

  return (
    <div className="assignee-selector">
      <MultiSelect
        options={options}
        value={currentAssignees}
        onChange={() => {
          void handleChange()
        }}
        placeholder="Unassigned"
        className="assignee-multi-select"
      />
    </div>
  )
}
