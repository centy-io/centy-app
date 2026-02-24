/* eslint-disable max-lines */
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  GetItemRequestSchema,
  UpdateItemRequestSchema,
  DeleteItemRequestSchema,
  type Issue,
} from '@/gen/centy_pb'
import { genericItemToIssue } from '@/lib/genericItemToIssue'
import { useStateManager } from '@/lib/state'

function formatErr(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to connect to daemon'
}

async function fetchOrgIssue(orgSlug: string, issueId: string) {
  const projectsRes = await centyClient.listProjects(
    create(ListProjectsRequestSchema, { organizationSlug: orgSlug })
  )
  const orgProjects = projectsRes.projects.filter(p => p.initialized)
  if (orgProjects.length === 0)
    return { error: 'No initialized projects in this organization' }
  const projectPath = orgProjects[0].path
  const res = await centyClient.getItem(
    create(GetItemRequestSchema, {
      projectPath,
      itemType: 'issues',
      itemId: issueId,
    })
  )
  return { projectPath, item: res.item, error: res.error }
}

async function saveOrgIssue(
  orgProjectPath: string,
  issueId: string,
  editTitle: string,
  editDescription: string,
  editPriority: number,
  editStatus: string
) {
  return centyClient.updateItem(
    create(UpdateItemRequestSchema, {
      projectPath: orgProjectPath,
      itemType: 'issues',
      itemId: issueId,
      title: editTitle.trim(),
      body: editDescription.trim(),
      priority: editPriority,
      status: editStatus,
    })
  )
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
  const router = useRouter()
  const stateManager = useStateManager()
  const stateOptions = stateManager.getStateOptions()

  const [orgProjectPath, setOrgProjectPath] = useState<string | null>(null)
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const editState = useOrgIssueEditState(issue)

  const fetchIssue = useCallback(async () => {
    if (!orgSlug || !issueId) return
    setLoading(true)
    setError(null)
    try {
      const result = await fetchOrgIssue(orgSlug, issueId)
      if (result.error) {
        setError(result.error)
        return
      }
      if (result.projectPath) setOrgProjectPath(result.projectPath)
      if (result.item) {
        const found = genericItemToIssue(result.item)
        setIssue(found)
        editState.initFromIssue(found)
      } else {
        setError('Issue not found')
      }
    } catch (err) {
      setError(formatErr(err))
    } finally {
      setLoading(false)
    }
  }, [orgSlug, issueId, editState])

  useEffect(() => {
    fetchIssue()
  }, [orgSlug, issueId, fetchIssue])

  const handleSave = useCallback(async () => {
    if (!orgProjectPath || !issueId) return
    setSaving(true)
    setError(null)
    try {
      const res = await saveOrgIssue(
        orgProjectPath,
        issueId,
        editState.editTitle,
        editState.editDescription,
        editState.editPriority,
        editState.editStatus
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
  }, [orgProjectPath, issueId, editState])

  const handleDelete = useCallback(async () => {
    if (!orgProjectPath || !issueId) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await centyClient.deleteItem(
        create(DeleteItemRequestSchema, {
          projectPath: orgProjectPath,
          itemType: 'issues',
          itemId: issueId,
        })
      )
      if (res.success)
        router.push(
          route({
            pathname: '/organizations/[orgSlug]/issues',
            query: { orgSlug },
          })
        )
      else setDeleteError(res.error || 'Failed to delete issue')
    } catch (err) {
      setDeleteError(formatErr(err))
    } finally {
      setDeleting(false)
    }
  }, [orgProjectPath, issueId, orgSlug, router])

  return {
    issue,
    loading,
    error,
    saving,
    showDeleteConfirm,
    deleting,
    deleteError,
    stateOptions,
    setShowDeleteConfirm,
    setDeleteError,
    handleSave,
    handleDelete,
    ...editState,
  }
}
