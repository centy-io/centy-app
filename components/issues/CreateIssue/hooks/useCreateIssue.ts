import { useState, useCallback, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { CreateIssueRequestSchema } from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import type {
  AssetUploaderHandle,
  PendingAsset,
} from '@/components/assets/AssetUploader'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { useStateManager } from '@/lib/state'
import { useProjectContext } from './useProjectContext'
import { useInitializationCheck } from './useInitializationCheck'

export function useCreateIssue() {
  const { projectPath, isInitialized, setIsInitialized } = useProject()
  const stateManager = useStateManager()
  const { navigateToIssue, navigateToIssuesList } =
    useProjectContext(projectPath)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState(2)
  const [status, setStatus] = useState(() => stateManager.getDefaultState())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([])
  const assetUploaderRef = useRef<AssetUploaderHandle>(null)
  const stateOptions = stateManager.getStateOptions()

  useInitializationCheck(projectPath, isInitialized, setIsInitialized)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!projectPath.trim() || !title.trim()) return
      setLoading(true)
      setError(null)
      try {
        const request = create(CreateIssueRequestSchema, {
          projectPath: projectPath.trim(),
          title: title.trim(),
          description: description.trim(),
          priority,
          status,
        })
        const response = await centyClient.createIssue(request)
        if (response.success) {
          if (pendingAssets.length > 0 && assetUploaderRef.current) {
            await assetUploaderRef.current.uploadAllPending(response.id)
          }
          navigateToIssue(response.issueNumber)
        } else {
          setError(response.error || 'Failed to create issue')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setLoading(false)
      }
    },
    [
      projectPath,
      title,
      description,
      priority,
      status,
      pendingAssets,
      navigateToIssue,
    ]
  )

  const handleKeyboardSave = useCallback(() => {
    if (!projectPath.trim() || !title.trim() || loading) return
    handleSubmit({ preventDefault: () => {} } as React.FormEvent)
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
    stateOptions,
    assetUploaderRef,
    setPendingAssets,
    handleSubmit,
    handleCancel: navigateToIssuesList,
  }
}
