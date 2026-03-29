import { useOrgIssueState } from './useOrgIssueState'
import { useOrgIssueMutations } from './useOrgIssueMutations'
import { useOrgIssueFetch } from './useOrgIssueFetch'

export function useOrgIssueDetail(orgSlug: string, issueId: string) {
  const st = useOrgIssueState()

  useOrgIssueFetch({
    orgSlug,
    issueId,
    setLoading: st.setLoading,
    setError: st.setError,
    setOrgProjectPath: st.setOrgProjectPath,
    setItemTypeStatuses: st.setItemTypeStatuses,
    setIssue: st.setIssue,
    setEditTitle: st.setEditTitle,
    setEditDescription: st.setEditDescription,
    setEditPriority: st.setEditPriority,
    setEditStatus: st.setEditStatus,
  })

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
