/* eslint-disable max-lines */
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import type { RouteLiteral } from 'nextjs-routes'
import { centyClient } from '@/lib/grpc/client'
import {
  UpdateItemRequestSchema,
  DeleteItemRequestSchema,
  type Issue,
} from '@/gen/centy_pb'
import { genericItemToIssue } from '@/lib/genericItemToIssue'

interface UseIssueActionsParams {
  projectPath: string
  issueNumber: string
  issuesListUrl: RouteLiteral
  setIssue: (issue: Issue) => void
  setError: (error: string | null) => void
}

interface SaveEditState {
  editTitle: string
  editDescription: string
  editStatus: string
  editPriority: number
  setIsEditing: (v: boolean) => void
}

async function saveIssueRequest(
  projectPath: string,
  issueNumber: string,
  editState: SaveEditState
) {
  const request = create(UpdateItemRequestSchema, {
    projectPath,
    itemType: 'issues',
    itemId: issueNumber,
    title: editState.editTitle,
    body: editState.editDescription,
    status: editState.editStatus,
    priority: editState.editPriority,
  })
  return centyClient.updateItem(request)
}

async function deleteIssueRequest(projectPath: string, issueNumber: string) {
  const request = create(DeleteItemRequestSchema, {
    projectPath,
    itemType: 'issues',
    itemId: issueNumber,
  })
  return centyClient.deleteItem(request)
}

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
    async (editState: SaveEditState) => {
      if (!projectPath || !issueNumber) return
      setSaving(true)
      setError(null)
      try {
        const response = await saveIssueRequest(
          projectPath,
          issueNumber,
          editState
        )
        if (response.success && response.item) {
          setIssue(genericItemToIssue(response.item))
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
      const response = await deleteIssueRequest(projectPath, issueNumber)
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
