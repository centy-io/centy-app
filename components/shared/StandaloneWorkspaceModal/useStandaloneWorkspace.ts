import { useState, useCallback, useEffect, useRef } from 'react'
import { EditorType } from '@/gen/centy_pb'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'
import type { StandaloneWorkspaceModalProps } from './StandaloneWorkspaceModal.types'
import { useModalDismiss } from './useModalDismiss'
import { useCreateWorkspace } from './useCreateWorkspace'

export function useStandaloneWorkspace({
  projectPath,
  onClose,
  onCreated,
}: StandaloneWorkspaceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { editors } = useDaemonStatus()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ttlHours, setTtlHours] = useState(12)
  const [selectedEditor, setSelectedEditor] = useState<EditorType>(
    EditorType.VSCODE
  )

  const isEditorAvailable = useCallback(
    (type: EditorType): boolean => {
      const editor = editors.find(e => e.editorType === type)
      return editor !== undefined ? editor.available : false
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

  useModalDismiss(modalRef, onClose)

  const { loading, error, handleCreate } = useCreateWorkspace(
    projectPath,
    name,
    description,
    ttlHours,
    selectedEditor,
    onCreated,
    onClose
  )

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
