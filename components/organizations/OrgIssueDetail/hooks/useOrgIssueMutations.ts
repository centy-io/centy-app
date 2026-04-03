import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { performSaveIssue } from './performSaveIssue'
import { performDeleteIssue } from './performDeleteIssue'
import { getEditFieldsFromIssue } from './getEditFieldsFromIssue'
import type { GenericItem } from '@/gen/centy_pb'

function formatErr(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to connect to daemon'
}

interface MutationParams {
  orgSlug: string
  issueId: string
  orgProjectPath: string | null
  issue: GenericItem | null
  editTitle: string
  editDescription: string
  editPriority: number
  editStatus: string
  setIssue: (v: GenericItem) => void
  setIsEditing: (v: boolean) => void
  setError: (v: string | null) => void
  setSaving: (v: boolean) => void
  setDeleteError: (v: string | null) => void
  setDeleting: (v: boolean) => void
  setEditTitle: (v: string) => void
  setEditDescription: (v: string) => void
  setEditPriority: (v: number) => void
  setEditStatus: (v: string) => void
}

export function useOrgIssueMutations(p: MutationParams) {
  const router = useRouter()

  const handleSave = useCallback(async () => {
    if (!p.orgProjectPath || !p.issueId) return
    p.setSaving(true)
    p.setError(null)
    try {
      const result = await performSaveIssue(
        p.orgProjectPath,
        p.issueId,
        p.editTitle,
        p.editDescription,
        p.editPriority,
        p.editStatus
      )
      if (typeof result === 'string') p.setError(result)
      else {
        p.setIssue(result)
        p.setIsEditing(false)
      }
    } catch (err) {
      p.setError(formatErr(err))
    } finally {
      p.setSaving(false)
    }
  }, [
    p.orgProjectPath,
    p.issueId,
    p.editTitle,
    p.editDescription,
    p.editPriority,
    p.editStatus,
  ])

  const handleDelete = useCallback(async () => {
    if (!p.orgProjectPath || !p.issueId) return
    p.setDeleting(true)
    p.setDeleteError(null)
    try {
      const err = await performDeleteIssue(p.orgProjectPath, p.issueId)
      if (err === null)
        router.push(
          route({
            pathname: '/organizations/[orgSlug]/issues',
            query: { orgSlug: p.orgSlug },
          })
        )
      else p.setDeleteError(err)
    } catch (err) {
      p.setDeleteError(formatErr(err))
    } finally {
      p.setDeleting(false)
    }
  }, [p.orgProjectPath, p.issueId, p.orgSlug, router])

  const handleCancelEdit = useCallback(() => {
    if (!p.issue) return
    p.setIsEditing(false)
    const f = getEditFieldsFromIssue(p.issue)
    p.setEditTitle(f.title)
    p.setEditDescription(f.description)
    p.setEditPriority(f.priority)
    p.setEditStatus(f.status)
  }, [p.issue])

  return { handleSave, handleDelete, handleCancelEdit }
}
