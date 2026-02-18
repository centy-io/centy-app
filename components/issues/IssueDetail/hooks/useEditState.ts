import { useState, useEffect } from 'react'
import type { Issue } from '@/gen/centy_pb'

export function useEditState(issue: Issue | null) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [editPriority, setEditPriority] = useState(0)
  const [assignees, setAssignees] = useState<string[]>([])

  useEffect(() => {
    if (!issue) return
    setEditTitle(issue.title)
    setEditDescription(issue.description)
    setEditStatus((issue.metadata && issue.metadata.status) || 'open')
    setEditPriority((issue.metadata && issue.metadata.priority) || 2)
  }, [issue])

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (!issue) return
    setEditTitle(issue.title)
    setEditDescription(issue.description)
    setEditStatus((issue.metadata && issue.metadata.status) || 'open')
    setEditPriority((issue.metadata && issue.metadata.priority) || 2)
  }

  return {
    isEditing,
    setIsEditing,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editStatus,
    setEditStatus,
    editPriority,
    setEditPriority,
    assignees,
    setAssignees,
    handleCancelEdit,
  }
}
