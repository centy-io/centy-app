import { useState, useCallback, useRef, useEffect } from 'react'
import { useProjectContext } from './useProjectContext'
import { useCreateIssueSubmit } from './useCreateIssueSubmit'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useStateManager } from '@/lib/state'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import {
  getDraftStorageKey,
  loadFormDraft,
  saveFormDraft,
  clearFormDraft,
} from '@/hooks/useFormDraft'
import type {
  AssetUploaderHandle,
  PendingAsset,
} from '@/components/assets/AssetUploader'

interface IssueDraft {
  title: string
  description: string
  priority: number
  status: string
}

export function useCreateIssue() {
  const { projectPath, isInitialized } = usePathContext()
  const stateManager = useStateManager()
  const stateOptions = stateManager.getStateOptions()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState(2)
  const [status, setStatus] = useState(() => stateManager.getDefaultState())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([])
  const assetUploaderRef = useRef<AssetUploaderHandle>(null)

  const draftKey = projectPath ? getDraftStorageKey('issue', projectPath) : ''
  const [draftLoaded, setDraftLoaded] = useState(false)

  useEffect(() => {
    if (!draftKey || draftLoaded) return
    const draft = loadFormDraft<IssueDraft>(draftKey)
    if (draft.title !== undefined) setTitle(draft.title)
    if (draft.description !== undefined) setDescription(draft.description)
    if (draft.priority !== undefined) setPriority(draft.priority)
    if (draft.status !== undefined) setStatus(draft.status)
    setDraftLoaded(true)
  }, [draftKey, draftLoaded])

  useEffect(() => {
    if (!draftKey || !draftLoaded) return
    saveFormDraft<IssueDraft>(draftKey, { title, description, priority, status })
  }, [draftKey, title, description, priority, status, draftLoaded])

  const clearDraft = useCallback(() => { clearFormDraft(draftKey) }, [draftKey])

  const { getProjectContext } = useProjectContext(projectPath)

  const { handleSubmit, handleCancel } = useCreateIssueSubmit({
    projectPath, title, description, priority, status,
    pendingAssets, assetUploaderRef, getProjectContext,
    setLoading, setError, clearDraft,
  })

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
