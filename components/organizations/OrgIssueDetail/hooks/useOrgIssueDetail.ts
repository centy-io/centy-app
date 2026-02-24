import { useState, useCallback, useEffect } from 'react'
import { useOrgIssueSave } from './useOrgIssueSave'
import { useOrgIssueDelete } from './useOrgIssueDelete'
import { fetchOrgIssue } from './fetchOrgIssue'
import { type Issue } from '@/gen/centy_pb'
import { genericItemToIssue } from '@/lib/genericItemToIssue'
import { useStateManager } from '@/lib/state'

function formatErr(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to connect to daemon'
}

function useOrgIssueEditState(issue: Issue | null) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPriority, setEditPriority] = useState(2)
  const [editStatus, setEditStatus] = useState('')
  const initFromIssue = useCallback((found: Issue) => {
    setEditTitle(found.title)
    setEditDescription(found.description)
    const meta = found.metadata
    setEditPriority(meta ? meta.priority : 2)
    setEditStatus(meta ? meta.status : '')
  }, [])
  const handleCancelEdit = useCallback(() => {
    if (!issue) return
    setIsEditing(false)
    initFromIssue(issue)
  }, [issue, initFromIssue])
  return {
    isEditing,
    setIsEditing,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editPriority,
    setEditPriority,
    editStatus,
    setEditStatus,
    initFromIssue,
    handleCancelEdit,
  }
}

export function useOrgIssueDetail(orgSlug: string, issueId: string) {
  const stateManager = useStateManager()
  const stateOptions = stateManager.getStateOptions()
  const [orgProjectPath, setOrgProjectPath] = useState<string | null>(null)
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const editState = useOrgIssueEditState(issue)
  const saveState = useOrgIssueSave(
    issueId,
    orgProjectPath,
    setIssue,
    editState
  )
  const deleteState = useOrgIssueDelete(orgSlug, issueId, orgProjectPath)

  const fetchIssue = useCallback(async () => {
    if (!orgSlug || !issueId) return
    setLoading(true)
    setLoadError(null)
    try {
      const result = await fetchOrgIssue(orgSlug, issueId)
      if (result.error) {
        setLoadError(result.error)
        return
      }
      if (result.projectPath) setOrgProjectPath(result.projectPath)
      if (result.item) {
        const found = genericItemToIssue(result.item)
        setIssue(found)
        editState.initFromIssue(found)
      } else setLoadError('Issue not found')
    } catch (err) {
      setLoadError(formatErr(err))
    } finally {
      setLoading(false)
    }
  }, [orgSlug, issueId, editState])

  useEffect(() => {
    fetchIssue()
  }, [orgSlug, issueId, fetchIssue])

  return {
    issue,
    loading,
    stateOptions,
    error: saveState.error || loadError,
    saving: saveState.saving,
    ...deleteState,
    ...editState,
    setError: saveState.setError,
    handleSave: saveState.handleSave,
  }
}
