import { useCallback } from 'react'
import { useProjectContext } from './useProjectContext'
import { useIssueDraft } from './useIssueDraft'
import { buildHandleSubmit } from './buildHandleSubmit'
import { useCreateIssueState } from './useCreateIssueState'
import { useCreateItemSubmit } from '@/hooks/useCreateItemSubmit'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'

export function useCreateIssue() {
  const { projectPath, isInitialized } = usePathContext()
  const s = useCreateIssueState()

  const {
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    clearDraft,
  } = useIssueDraft(projectPath)

  const { getProjectContext } = useProjectContext(projectPath)
  const { submitItem, handleCancel } = useCreateItemSubmit({
    kind: 'issue',
    projectPath,
    getProjectContext,
    setLoading: s.setLoading,
    setError: s.setError,
    clearDraft,
  })

  const handleSubmit = useCallback(
    (e?: React.FormEvent) =>
      buildHandleSubmit({
        title,
        description,
        priority,
        status: s.status,
        pendingAssets: s.pendingAssets,
        assetUploaderRef: s.assetUploaderRef,
        projectPath,
        submitItem,
      })(e),
    [
      title,
      description,
      priority,
      s.status,
      s.pendingAssets,
      projectPath,
      submitItem,
    ]
  )

  const handleKeyboardSave = useCallback(() => {
    if (!projectPath.trim() || !title.trim() || s.loading) return
    void handleSubmit()
  }, [projectPath, title, s.loading, handleSubmit])

  useSaveShortcut({
    onSave: handleKeyboardSave,
    enabled: !!projectPath.trim() && !!title.trim() && !s.loading,
  })

  return {
    projectPath,
    isInitialized,
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    status: s.status,
    setStatus: s.setStatus,
    loading: s.loading,
    error: s.error,
    pendingAssets: s.pendingAssets,
    setPendingAssets: s.setPendingAssets,
    assetUploaderRef: s.assetUploaderRef,
    stateOptions: s.stateOptions,
    handleSubmit,
    handleCancel,
  }
}
