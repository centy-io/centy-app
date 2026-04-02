import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import type { RouteLiteral } from 'nextjs-routes'
import { performSave } from './performSave'
import { callItemApi } from '@/lib/callItemApi'
import { centyClient } from '@/lib/grpc/client'
import {
  DeleteItemRequestSchema,
  SoftDeleteItemRequestSchema,
  type Issue,
} from '@/gen/centy_pb'

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
    const res = await callItemApi(
      () =>
        centyClient.deleteItem(
          create(DeleteItemRequestSchema, {
            projectPath,
            itemType: 'issues',
            itemId: issueNumber,
          })
        ),
      setDeleting,
      setError
    )
    if (res && res.success) router.push(issuesListUrl)
    else if (res) setError(res.error || 'Failed to delete issue')
  }, [projectPath, issueNumber, router, issuesListUrl, setError])

  const handleSoftDelete = useCallback(async () => {
    if (!projectPath || !issueNumber) return
    const res = await callItemApi(
      () =>
        centyClient.softDeleteItem(
          create(SoftDeleteItemRequestSchema, {
            projectPath,
            itemType: 'issues',
            itemId: issueNumber,
          })
        ),
      setDeleting,
      setError
    )
    if (res && res.success) router.push(issuesListUrl)
    else if (res) setError(res.error || 'Failed to archive issue')
  }, [projectPath, issueNumber, router, issuesListUrl, setError])

  return {
    saving,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleSave,
    handleDelete,
    handleSoftDelete,
  }
}
