import { useState, useCallback } from 'react'
import type { Issue } from '@/gen/centy_pb'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'

interface UseEditStateParams {
  issue: Issue | null
  onSave: (editState: {
    title: string
    description: string
    status: string
    priority: number
  }) => Promise<boolean | undefined>
  saving: boolean
}

export function useEditState({ issue, onSave, saving }: UseEditStateParams) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [editPriority, setEditPriority] = useState(0)

  const handleSave = useCallback(async () => {
    const success = await onSave({
      title: editTitle,
      description: editDescription,
      status: editStatus,
      priority: editPriority,
    })
    if (success) setIsEditing(false)
  }, [onSave, editTitle, editDescription, editStatus, editPriority])

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    if (issue) {
      setEditTitle(issue.title)
      setEditDescription(issue.description)
      setEditStatus(issue.metadata?.status || 'open')
      setEditPriority(issue.metadata?.priority || 2)
    }
  }, [issue])

  const handleStartEdit = useCallback(() => {
    if (issue) {
      setEditTitle(issue.title)
      setEditDescription(issue.description)
      setEditStatus(issue.metadata?.status || 'open')
      setEditPriority(issue.metadata?.priority || 2)
    }
    setIsEditing(true)
  }, [issue])

  useSaveShortcut({
    onSave: handleSave,
    enabled: isEditing && !saving && !!editTitle.trim(),
  })

  return {
    isEditing,
    editTitle,
    editDescription,
    editStatus,
    editPriority,
    setEditTitle,
    setEditDescription,
    setEditStatus,
    setEditPriority,
    handleSave,
    handleCancelEdit,
    handleStartEdit,
  }
}
