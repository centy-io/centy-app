import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  OpenStandaloneWorkspaceRequestSchema,
  EditorType,
} from '@/gen/centy_pb'

export function useCreateWorkspace(
  projectPath: string,
  name: string,
  description: string,
  ttlHours: number,
  selectedEditor: EditorType,
  onCreated: ((workspacePath: string) => void) | undefined,
  onClose: () => void
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = useCallback(async () => {
    if (!projectPath) return
    setLoading(true)
    setError(null)
    try {
      const request = create(OpenStandaloneWorkspaceRequestSchema, {
        projectPath,
        name: name.trim() || undefined,
        description: description.trim() || undefined,
        agentName: '',
        ttlHours,
      })
      const rpcMethod =
        selectedEditor === EditorType.VSCODE
          ? centyClient.openStandaloneWorkspaceVscode
          : centyClient.openStandaloneWorkspaceTerminal
      const response = await rpcMethod(request)
      if (response.success) {
        if (onCreated) onCreated(response.workspacePath)
        onClose()
      } else {
        setError(response.error || 'Failed to create workspace')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create workspace'
      )
    } finally {
      setLoading(false)
    }
  }, [
    projectPath,
    name,
    description,
    ttlHours,
    selectedEditor,
    onCreated,
    onClose,
  ])

  return { loading, error, handleCreate }
}
