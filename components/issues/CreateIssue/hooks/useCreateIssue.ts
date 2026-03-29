import { useState, useCallback, useRef } from 'react'
import { useProjectContext } from './useProjectContext'
import { useIssueDraft } from './useIssueDraft'
import { buildCreateItemResult } from './buildCreateItemResult'
import { useCreateItemSubmit } from '@/hooks/useCreateItemSubmit'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useStateManager } from '@/lib/state'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import type {
  AssetUploaderHandle,
  PendingAsset,
} from '@/components/assets/AssetUploader'

export function useCreateIssue() {
  const { projectPath, isInitialized } = usePathContext()
  const stateManager = useStateManager()
  const stateOptions = stateManager.getStateOptions()

  const {
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    clearDraft,
  } = useIssueDraft(projectPath)
  const [status, setStatus] = useState(() => stateManager.getDefaultState())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([])
  const assetUploaderRef = useRef<AssetUploaderHandle>(null)

  const { getProjectContext } = useProjectContext(projectPath)
  const { submitItem, handleCancel } = useCreateItemSubmit({
    kind: 'issue',
    projectPath,
    getProjectContext,
    setLoading,
    setError,
    clearDraft,
  })

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (!title.trim()) return
      return submitItem(
        () =>
          buildCreateItemResult({
            projectPath,
            title,
            description,
            priority,
            status,
            pendingAssets,
            assetUploaderRef,
          }),
        e
      )
    },
    [
      title,
      description,
      priority,
      status,
      pendingAssets,
      assetUploaderRef,
      projectPath,
      submitItem,
    ]
  )

  const handleKeyboardSave = useCallback(() => {
    if (!projectPath.trim() || !title.trim() || loading) return
    void handleSubmit()
  }, [projectPath, title, loading, handleSubmit])

  useSaveShortcut({
    onSave: handleKeyboardSave,
    enabled: !!projectPath.trim() && !!title.trim() && !loading,
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
    status,
    setStatus,
    loading,
    error,
    pendingAssets,
    setPendingAssets,
    assetUploaderRef,
    stateOptions,
    handleSubmit,
    handleCancel,
  }
}
