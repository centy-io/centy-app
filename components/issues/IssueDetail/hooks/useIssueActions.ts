import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import type { RouteLiteral } from 'nextjs-routes'
import { centyClient } from '@/lib/grpc/client'
import {
  UpdateIssueRequestSchema,
  DeleteIssueRequestSchema,
  type Issue,
} from '@/gen/centy_pb'

interface UseIssueActionsParams {
  projectPath: string
  issueNumber: string
  issuesListUrl: RouteLiteral
  setIssue: (issue: Issue) => void
  setError: (error: string | null) => void
}

// eslint-disable-next-line max-lines-per-function
export function useIssueActions({
  projectPath,
  issueNumber,
  issuesListUrl,
  setIssue,
  setError,
}: UseIssueActionsParams) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = useCallback(
    async (editState: {
      editTitle: string
      editDescription: string
      editStatus: string
      editPriority: number
      setIsEditing: (v: boolean) => void
    }) => {
      if (!projectPath || !issueNumber) return
      setSaving(true)
      setError(null)

      try {
        const request = create(UpdateIssueRequestSchema, {
          projectPath,
          issueId: issueNumber,
          title: editState.editTitle,
          description: editState.editDescription,
          status: editState.editStatus,
          priority: editState.editPriority,
        })
        const response = await centyClient.updateIssue(request)
        if (response.success && response.issue) {
          setIssue(response.issue)
          editState.setIsEditing(false)
        } else {
          setError(response.error || 'Failed to update issue')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
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
        router.push(issuesListUrl)
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
  }, [projectPath, issueNumber, router, issuesListUrl, setError])

  return {
    saving,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleSave,
    handleDelete,
  }
}
