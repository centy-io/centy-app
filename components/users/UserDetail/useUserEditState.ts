import { useState } from 'react'
import type { User } from '@/gen/centy_pb'

export function useUserEditState() {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editGitUsernames, setEditGitUsernames] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const populateFromUser = (user: User) => {
    setEditName(user.name)
    setEditEmail(user.email || '')
    setEditGitUsernames([...user.gitUsernames])
  }

  const handleCancelEdit = (user: User | null) => {
    setIsEditing(false)
    if (user) populateFromUser(user)
  }

  return {
    isEditing,
    setIsEditing,
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    editGitUsernames,
    setEditGitUsernames,
    saving,
    setSaving,
    populateFromUser,
    handleCancelEdit,
  }
}
