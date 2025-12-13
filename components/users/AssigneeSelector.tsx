'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { centyClient } from '@/lib/grpc/client'
import { create } from '@bufbuild/protobuf'
import {
  ListUsersRequestSchema,
  AssignIssueRequestSchema,
  UnassignIssueRequestSchema,
  type User,
} from '@/gen/centy_pb'
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
  issueId,
  currentAssignees,
  onAssigneesChange,
}: AssigneeSelectorProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    if (!projectPath) return

    setLoading(true)
    setError(null)

    try {
      const request = create(ListUsersRequestSchema, {
        projectPath,
      })
      const response = await centyClient.listUsers(request)
      setUsers(response.users)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load users'
      if (message.includes('unimplemented')) {
        setError('User management not available')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }, [projectPath])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const options: MultiSelectOption[] = useMemo(
    () =>
      users.map(user => ({
        value: user.id,
        label: user.name,
      })),
    [users]
  )

  const handleChange = useCallback(
    async (newAssignees: string[]) => {
      if (!projectPath || !issueId || updating) return

      const toAssign = newAssignees.filter(id => !currentAssignees.includes(id))
      const toUnassign = currentAssignees.filter(
        id => !newAssignees.includes(id)
      )

      if (toAssign.length === 0 && toUnassign.length === 0) return

      setUpdating(true)
      setError(null)

      try {
        // Assign new users
        if (toAssign.length > 0) {
          const assignRequest = create(AssignIssueRequestSchema, {
            projectPath,
            issueId,
            userIds: toAssign,
          })
          const response = await centyClient.assignIssue(assignRequest)
          if (!response.success) {
            setError(response.error || 'Failed to assign users')
            return
          }
        }

        // Unassign removed users
        if (toUnassign.length > 0) {
          const unassignRequest = create(UnassignIssueRequestSchema, {
            projectPath,
            issueId,
            userIds: toUnassign,
          })
          const response = await centyClient.unassignIssue(unassignRequest)
          if (!response.success) {
            setError(response.error || 'Failed to unassign users')
            return
          }
        }

        onAssigneesChange(newAssignees)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to update assignees'
        )
      } finally {
        setUpdating(false)
      }
    },
    [projectPath, issueId, currentAssignees, onAssigneesChange, updating]
  )

  if (loading) {
    return (
      <div className="assignee-selector loading">
        <span className="loading-text">Loading users...</span>
      </div>
    )
  }

  if (error) {
    const isUnimplemented = error.includes('not available')
    return (
      <div className="assignee-selector error">
        <span className="error-text">{error}</span>
        {!isUnimplemented && (
          <button onClick={fetchUsers} className="retry-btn">
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
    <div className={`assignee-selector ${updating ? 'updating' : ''}`}>
      <MultiSelect
        options={options}
        value={currentAssignees}
        onChange={handleChange}
        placeholder="Unassigned"
        className="assignee-multi-select"
      />
      {updating && <span className="updating-indicator">Saving...</span>}
    </div>
  )
}
