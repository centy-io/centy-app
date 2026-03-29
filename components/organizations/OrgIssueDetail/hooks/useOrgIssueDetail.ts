import { useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { useOrgIssueState } from './useOrgIssueState'
import { useOrgIssueMutations } from './useOrgIssueMutations'
import { getEditFieldsFromIssue } from './getEditFieldsFromIssue'
import { fetchOrgProjectPathAndStatuses } from './fetchOrgProjectPathAndStatuses'
import { centyClient } from '@/lib/grpc/client'
import { GetItemRequestSchema, type Issue } from '@/gen/centy_pb'
import { genericItemToIssue } from '@/lib/genericItemToIssue'

function formatErr(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to connect to daemon'
}

function applyIssueToState(
  issue: Issue,
  setEditTitle: (v: string) => void,
  setEditDescription: (v: string) => void,
  setEditPriority: (v: number) => void,
  setEditStatus: (v: string) => void
): void {
  const f = getEditFieldsFromIssue(issue)
  setEditTitle(f.title)
  setEditDescription(f.description)
  setEditPriority(f.priority)
  setEditStatus(f.status)
}

export function useOrgIssueDetail(orgSlug: string, issueId: string) {
  const st = useOrgIssueState()

  useEffect(() => {
    if (!orgSlug || !issueId) return
    st.setLoading(true)
    st.setError(null)
    fetchOrgProjectPathAndStatuses(orgSlug)
      .then(pathResult => {
        if (typeof pathResult === 'string') {
          st.setError(pathResult)
          st.setLoading(false)
          return
        }
        st.setOrgProjectPath(pathResult.projectPath)
        st.setItemTypeStatuses(pathResult.statuses)
        return centyClient.getItem(
          create(GetItemRequestSchema, {
            projectPath: pathResult.projectPath,
            itemType: 'issues',
            itemId: issueId,
          })
        )
      })
      .then(res => {
        if (!res) return
        if (res.item) {
          const found = genericItemToIssue(res.item)
          st.setIssue(found)
          applyIssueToState(
            found,
            st.setEditTitle,
            st.setEditDescription,
            st.setEditPriority,
            st.setEditStatus
          )
        } else {
          st.setError(res.error || 'Issue not found')
        }
      })
      .catch(err => {
        st.setError(formatErr(err))
      })
      .finally(() => {
        st.setLoading(false)
      })
  }, [orgSlug, issueId])

  const mutations = useOrgIssueMutations({
    orgSlug,
    issueId,
    orgProjectPath: st.orgProjectPath,
    issue: st.issue,
    editTitle: st.editTitle,
    editDescription: st.editDescription,
    editPriority: st.editPriority,
    editStatus: st.editStatus,
    setIssue: st.setIssue,
    setIsEditing: st.setIsEditing,
    setError: st.setError,
    setSaving: st.setSaving,
    setDeleteError: st.setDeleteError,
    setDeleting: st.setDeleting,
    setEditTitle: st.setEditTitle,
    setEditDescription: st.setEditDescription,
    setEditPriority: st.setEditPriority,
    setEditStatus: st.setEditStatus,
  })

  return {
    issue: st.issue,
    loading: st.loading,
    error: st.error,
    isEditing: st.isEditing,
    editTitle: st.editTitle,
    editDescription: st.editDescription,
    editPriority: st.editPriority,
    editStatus: st.editStatus,
    saving: st.saving,
    showDeleteConfirm: st.showDeleteConfirm,
    deleting: st.deleting,
    deleteError: st.deleteError,
    stateOptions: st.stateOptions,
    setIsEditing: st.setIsEditing,
    setEditTitle: st.setEditTitle,
    setEditDescription: st.setEditDescription,
    setEditPriority: st.setEditPriority,
    setEditStatus: st.setEditStatus,
    setShowDeleteConfirm: st.setShowDeleteConfirm,
    setDeleteError: st.setDeleteError,
    ...mutations,
  }
}
