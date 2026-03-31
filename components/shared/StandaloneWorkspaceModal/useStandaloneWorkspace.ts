import { useState, useCallback, useRef } from 'react'
import type { StandaloneWorkspaceModalProps } from './StandaloneWorkspaceModal.types'
import { useModalDismiss } from './useModalDismiss'
import { useCreateWorkspace } from './useCreateWorkspace'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'

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
  const [selectedEditor, setSelectedEditor] = useState<string>('terminal')

  const isEditorAvailable = useCallback(
    (editorId: string): boolean => {
      const editor = editors.find(e => e.editorId === editorId)
      return editor !== undefined ? editor.available : false
    },
    [editors]
  )

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

  const hasAvailableEditor = isEditorAvailable('terminal')

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
