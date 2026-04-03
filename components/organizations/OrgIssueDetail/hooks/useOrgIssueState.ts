import { useState, useMemo } from 'react'
import { StateManager } from '@/lib/state'
import type { GenericItem } from '@/gen/centy_pb'

export function useOrgIssueState() {
  const [itemTypeStatuses, setItemTypeStatuses] = useState<string[]>([])
  const stateOptions = useMemo(
    () => new StateManager(null, itemTypeStatuses).getStateOptions(),
    [itemTypeStatuses]
  )
  const [orgProjectPath, setOrgProjectPath] = useState<string | null>(null)
  const [issue, setIssue] = useState<GenericItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPriority, setEditPriority] = useState(2)
  const [editStatus, setEditStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  return {
    itemTypeStatuses,
    setItemTypeStatuses,
    stateOptions,
    orgProjectPath,
    setOrgProjectPath,
    issue,
    setIssue,
    loading,
    setLoading,
    error,
    setError,
    isEditing,
    setIsEditing,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editPriority,
    setEditPriority,
    editStatus,
    setEditStatus,
    saving,
    setSaving,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleting,
    setDeleting,
    deleteError,
    setDeleteError,
  }
}
