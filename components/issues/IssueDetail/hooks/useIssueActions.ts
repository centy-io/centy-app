import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  UpdateIssueRequestSchema,
  DeleteIssueRequestSchema,
  type Issue,
} from '@/gen/centy_pb'

interface UseIssueActionsParams {
  projectPath: string
  issueNumber: string
  issue: Issue | null
  setIssue: (issue: Issue) => void
  setError: (error: string | null) => void
  onDeleted: () => void
}

export function useIssueActions({
  projectPath,
  issueNumber,
  issue,
  setIssue,
  setError,
  onDeleted,
}: UseIssueActionsParams) {
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = useCallback(
    async (editState: {
      title: string
      description: string
      status: string
      priority: number
    }) => {
      if (!projectPath || !issueNumber) return false

      setSaving(true)
      setError(null)

      try {
        const request = create(UpdateIssueRequestSchema, {
          projectPath,
          issueId: issueNumber,
          title: editState.title,
          description: editState.description,
          status: editState.status,
          priority: editState.priority,
        })
        const response = await centyClient.updateIssue(request)

        if (response.success && response.issue) {
          setIssue(response.issue)
          return true
        } else {
          setError(response.error || 'Failed to update issue')
          return false
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
        return false
      } finally {
        setSaving(false)
      }
    },
    [projectPath, issueNumber, setIssue, setError]
  )

  const handleDelete = useCallback(async () => {
    if (!projectPath || !issueNumber) return

    setDeleting(true)
    setError(null)

    try {
      const request = create(DeleteIssueRequestSchema, {
        projectPath,
        issueId: issueNumber,
      })
      const response = await centyClient.deleteIssue(request)

      if (response.success) {
        onDeleted()
      } else {
        setError(response.error || 'Failed to delete issue')
        setShowDeleteConfirm(false)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }, [projectPath, issueNumber, setError, onDeleted])

  return {
    saving,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleSave,
    handleDelete,
  }
}
