import { useState, useCallback, useEffect } from 'react'
import { EditorType } from '@/gen/centy_pb'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'
import { useModalDismiss } from '@/components/shared/useModalDismiss'
import { createWorkspace } from './createWorkspace'

export function useStandaloneWorkspace(
  projectPath: string,
  onClose: () => void,
  onCreated?: (workspacePath: string) => void
) {
  const modalRef = useModalDismiss(onClose)
  const { editors } = useDaemonStatus()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ttlHours, setTtlHours] = useState(12)
  const [selectedEditor, setSelectedEditor] = useState<EditorType>(
    EditorType.VSCODE
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditorAvailable = useCallback(
    (type: EditorType): boolean => {
      const editor = editors.find(e => e.editorType === type)
      return editor?.available ?? false
    },
    [editors]
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        !isEditorAvailable(EditorType.VSCODE) &&
        isEditorAvailable(EditorType.TERMINAL)
      ) {
        setSelectedEditor(EditorType.TERMINAL)
      }
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [isEditorAvailable])

  const handleCreate = useCallback(async () => {
    if (!projectPath) return
    setLoading(true)
    setError(null)
    try {
      const result = await createWorkspace({
        projectPath,
        name,
        description,
        ttlHours,
        selectedEditor,
      })
      if (result.success) {
        onCreated?.(result.workspacePath)
        onClose()
      } else {
        setError(result.error || 'Failed to create workspace')
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

  const hasAvailableEditor =
    isEditorAvailable(EditorType.VSCODE) ||
    isEditorAvailable(EditorType.TERMINAL)

  return {
    modalRef,
    name,
    setName,
    description,
    setDescription,
    ttlHours,
    setTtlHours,
    selectedEditor,
    setSelectedEditor,
    loading,
    error,
    isEditorAvailable,
    hasAvailableEditor,
    handleCreate,
  }
}
