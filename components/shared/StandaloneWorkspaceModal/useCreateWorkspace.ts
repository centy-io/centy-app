import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { OpenStandaloneWorkspaceWithEditorRequestSchema } from '@/gen/centy_pb'

export function useCreateWorkspace(
  projectPath: string,
  name: string,
  description: string,
  ttlHours: number,
  selectedEditor: string,
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
      const request = create(OpenStandaloneWorkspaceWithEditorRequestSchema, {
        projectPath,
        name: name.trim() || undefined,
        description: description.trim() || undefined,
        ttlHours,
        editorId: selectedEditor,
      })
      const response = await centyClient.openStandaloneWorkspace(request)
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
