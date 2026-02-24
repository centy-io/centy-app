'use client'

import { useCallback, useState } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateItemRequestSchema, type Issue } from '@/gen/centy_pb'
import { genericItemToIssue } from '@/lib/genericItemToIssue'

interface EditState {
  editTitle: string
  editDescription: string
  editPriority: number
  editStatus: string
  setIsEditing: (v: boolean) => void
}

function formatErr(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to connect to daemon'
}

export function useOrgIssueSave(
  issueId: string,
  orgProjectPath: string | null,
  setIssue: (issue: Issue) => void,
  editState: EditState
) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = useCallback(async () => {
    if (!orgProjectPath || !issueId) return
    setSaving(true)
    setError(null)
    try {
      const res = await centyClient.updateItem(
        create(UpdateItemRequestSchema, {
          projectPath: orgProjectPath,
          itemType: 'issues',
          itemId: issueId,
          title: editState.editTitle.trim(),
          body: editState.editDescription.trim(),
          priority: editState.editPriority,
          status: editState.editStatus,
        })
      )
      if (res.success && res.item) {
        setIssue(genericItemToIssue(res.item))
        editState.setIsEditing(false)
      } else setError(res.error || 'Failed to update issue')
    } catch (err) {
      setError(formatErr(err))
    } finally {
      setSaving(false)
    }
  }, [orgProjectPath, issueId, editState, setIssue])

  return { saving, error, setError, handleSave }
}
