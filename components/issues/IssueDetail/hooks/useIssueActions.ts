import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import type { RouteLiteral } from 'nextjs-routes'
import { performSave } from './performSave'
import { centyClient } from '@/lib/grpc/client'
import { DeleteItemRequestSchema, type Issue } from '@/gen/centy_pb'

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
      await performSave(
        projectPath,
        issueNumber,
        editState,
        setIssue,
        setError,
        setSaving
      )
    },
    [projectPath, issueNumber, setIssue, setError]
  )

  const handleDelete = useCallback(async () => {
    if (!projectPath || !issueNumber) return
    setDeleting(true)
    setError(null)
    try {
      const request = create(DeleteItemRequestSchema, {
        projectPath,
        itemType: 'issues',
        itemId: issueNumber,
      })
      const response = await centyClient.deleteItem(request)
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
