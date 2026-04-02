import { useCallback } from 'react'
import { useProjectContext } from './useProjectContext'
import { useIssueDraft } from './useIssueDraft'
import { buildHandleSubmit } from './buildHandleSubmit'
import { useCreateIssueState } from './useCreateIssueState'
import { buildCreateIssueReturn } from './buildCreateIssueReturn'
import { useCreateItemSubmit } from '@/hooks/useCreateItemSubmit'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'

export function useCreateIssue() {
  const { projectPath, isInitialized } = usePathContext()
  const s = useCreateIssueState()
  const draft = useIssueDraft(projectPath)
  const { getProjectContext } = useProjectContext(projectPath)
  const { submitItem, handleCancel } = useCreateItemSubmit({
    kind: 'issue',
    projectPath,
    getProjectContext,
    setLoading: s.setLoading,
    setError: s.setError,
    clearDraft: draft.clearDraft,
  })

  const handleSubmit = useCallback(
    (e?: React.FormEvent) =>
      buildHandleSubmit({
        title: draft.title,
        description: draft.description,
        priority: draft.priority,
        status: s.status,
        pendingAssets: s.pendingAssets,
        assetUploaderRef: s.assetUploaderRef,
        projectPath,
        submitItem,
      })(e),
    [
      draft.title,
      draft.description,
      draft.priority,
      s.status,
      s.pendingAssets,
      projectPath,
      submitItem,
    ]
  )

  const handleKeyboardSave = useCallback(() => {
    if (!projectPath.trim() || !draft.title.trim() || s.loading) return
    void handleSubmit()
  }, [projectPath, draft.title, s.loading, handleSubmit])

  useSaveShortcut({
    onSave: handleKeyboardSave,
    enabled: !!projectPath.trim() && !!draft.title.trim() && !s.loading,
  })

  return buildCreateIssueReturn({
    projectPath,
    isInitialized,
    draft,
    s,
    handleSubmit,
    handleCancel,
  })
}
