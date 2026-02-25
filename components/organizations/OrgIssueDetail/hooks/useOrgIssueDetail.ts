/* eslint-disable max-lines */
import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  ListItemTypesRequestSchema,
  GetItemRequestSchema,
  UpdateItemRequestSchema,
  DeleteItemRequestSchema,
  type Issue,
} from '@/gen/centy_pb'
import { genericItemToIssue } from '@/lib/genericItemToIssue'
import { StateManager } from '@/lib/state'

function formatErr(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to connect to daemon'
}

// eslint-disable-next-line max-lines-per-function
export function useOrgIssueDetail(orgSlug: string, issueId: string) {
  const router = useRouter()

  const [itemTypeStatuses, setItemTypeStatuses] = useState<string[]>([])
  const stateOptions = useMemo(
    () => new StateManager(null, itemTypeStatuses).getStateOptions(),
    [itemTypeStatuses]
  )

  const [orgProjectPath, setOrgProjectPath] = useState<string | null>(null)
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPriority, setEditPriority] = useState(2)
  const [editStatus, setEditStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fetchIssue = useCallback(async () => {
    if (!orgSlug || !issueId) return
    setLoading(true)
    setError(null)
    try {
      const projectsRes = await centyClient.listProjects(
        create(ListProjectsRequestSchema, { organizationSlug: orgSlug })
      )
      const orgProjects = projectsRes.projects.filter(p => p.initialized)
      if (orgProjects.length === 0) {
        setError('No initialized projects in this organization')
        setLoading(false)
        return
      }

      const projectPath = orgProjects[0].path
      setOrgProjectPath(projectPath)

      try {
        const itemTypesRes = await centyClient.listItemTypes(
          create(ListItemTypesRequestSchema, { projectPath })
        )
        const issueType = itemTypesRes.itemTypes.find(t => t.plural === 'issues')
        if (issueType) {
          setItemTypeStatuses(issueType.statuses)
        }
      } catch {
        // fall back to defaults
      }

      const res = await centyClient.getItem(
        create(GetItemRequestSchema, {
          projectPath,
          itemType: 'issues',
          itemId: issueId,
        })
      )
      if (res.item) {
        const found = genericItemToIssue(res.item)
        setIssue(found)
        setEditTitle(found.title)
        setEditDescription(found.description)
        const meta = found.metadata
        setEditPriority(meta ? meta.priority : 2)
        setEditStatus(meta ? meta.status : '')
      } else {
        setError(res.error || 'Issue not found')
      }
    } catch (err) {
      setError(formatErr(err))
    } finally {
      setLoading(false)
    }
  }, [orgSlug, issueId])

  useEffect(() => {
    fetchIssue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgSlug, issueId])

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
          title: editTitle.trim(),
          body: editDescription.trim(),
          priority: editPriority,
          status: editStatus,
        })
      )
      if (res.success && res.item) {
        setIssue(genericItemToIssue(res.item))
        setIsEditing(false)
      } else {
        setError(res.error || 'Failed to update issue')
      }
    } catch (err) {
      setError(formatErr(err))
    } finally {
      setSaving(false)
    }
  }, [
    orgProjectPath,
    issueId,
    editTitle,
    editDescription,
    editPriority,
    editStatus,
  ])

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
      if (res.success) {
        router.push(
          route({
            pathname: '/organizations/[orgSlug]/issues',
            query: { orgSlug },
          })
        )
      } else {
        setDeleteError(res.error || 'Failed to delete issue')
      }
    } catch (err) {
      setDeleteError(formatErr(err))
    } finally {
      setDeleting(false)
    }
  }, [orgProjectPath, issueId, orgSlug, router])

  const handleCancelEdit = useCallback(() => {
    if (!issue) return
    setIsEditing(false)
    setEditTitle(issue.title)
    setEditDescription(issue.description)
    const meta = issue.metadata
    setEditPriority(meta ? meta.priority : 2)
    setEditStatus(meta ? meta.status : '')
  }, [issue])

  return {
    issue,
    loading,
    error,
    isEditing,
    editTitle,
    editDescription,
    editPriority,
    editStatus,
    saving,
    showDeleteConfirm,
    deleting,
    deleteError,
    stateOptions,
    setIsEditing,
    setEditTitle,
    setEditDescription,
    setEditPriority,
    setEditStatus,
    setShowDeleteConfirm,
    setDeleteError,
    handleSave,
    handleDelete,
    handleCancelEdit,
  }
}
