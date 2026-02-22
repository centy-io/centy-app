/* eslint-disable max-lines */
import { useState, useCallback, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import { useProjectContext } from './useProjectContext'
import { useCreateItemSubmit } from '@/hooks/useCreateItemSubmit'
import { centyClient } from '@/lib/grpc/client'
import {
  IsInitializedRequestSchema,
  CreateIssueRequestSchema,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { useStateManager } from '@/lib/state'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { getDraftStorageKey } from '@/hooks/getDraftStorageKey'
import { loadFormDraft } from '@/hooks/loadFormDraft'
import { saveFormDraft } from '@/hooks/saveFormDraft'
import { clearFormDraft } from '@/hooks/clearFormDraft'
import type {
  AssetUploaderHandle,
  PendingAsset,
} from '@/components/assets/AssetUploader'

interface IssueDraft {
  title: string
  description: string
  priority: number
}

// eslint-disable-next-line max-lines-per-function
export function useCreateIssue() {
  const { projectPath, isInitialized, setIsInitialized } = useProject()
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
  const [draftLoaded, setDraftLoaded] = useState(false)

  const draftKey = projectPath ? getDraftStorageKey('issue', projectPath) : ''

  // Load draft from localStorage when projectPath becomes available
  useEffect(() => {
    if (!draftKey || draftLoaded) return
    const draft = loadFormDraft<IssueDraft>(draftKey)
    if (draft.title !== undefined) setTitle(draft.title)
    if (draft.description !== undefined) setDescription(draft.description)
    if (draft.priority !== undefined) setPriority(draft.priority)
    setDraftLoaded(true)
  }, [draftKey, draftLoaded])

  // Auto-save draft on field changes
  useEffect(() => {
    if (!draftKey || !draftLoaded) return
    saveFormDraft<IssueDraft>(draftKey, { title, description, priority })
  }, [draftKey, title, description, priority, draftLoaded])

  const clearDraft = useCallback(() => {
    clearFormDraft(draftKey)
  }, [draftKey])

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
      return submitItem(async () => {
        const request = create(CreateIssueRequestSchema, {
          projectPath: projectPath.trim(),
          title: title.trim(),
          description: description.trim(),
          priority,
          status,
        })
        const response = await centyClient.createIssue(request)
        if (
          response.success &&
          pendingAssets.length > 0 &&
          assetUploaderRef.current
        ) {
          await assetUploaderRef.current.uploadAllPending(response.id)
        }
        return response
      }, e)
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

  const checkInitialized = useCallback(
    async (path: string) => {
      if (!path.trim()) {
        setIsInitialized(null)
        return
      }
      try {
        const request = create(IsInitializedRequestSchema, {
          projectPath: path.trim(),
        })
        const response = await centyClient.isInitialized(request)
        setIsInitialized(response.initialized)
      } catch {
        setIsInitialized(false)
      }
    },
    [setIsInitialized]
  )

  useEffect(() => {
    if (projectPath && isInitialized === null) {
      checkInitialized(projectPath)
    }
  }, [projectPath, isInitialized, checkInitialized])

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
