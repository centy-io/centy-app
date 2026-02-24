'use client'

import { type RouteLiteral } from 'nextjs-routes'
import { useSaveUser, type EditState } from './useSaveUser'
import { useDeleteUser } from './useDeleteUser'
import { type User } from '@/gen/centy_pb'

export function useUserMutations(
  projectPath: string,
  userId: string,
  usersListUrl: RouteLiteral,
  editState: EditState,
  setUser: (user: User) => void,
  setIsEditing: (v: boolean) => void,
  setError: (e: string | null) => void
) {
  const { saving, handleSave } = useSaveUser(
    projectPath,
    userId,
    editState,
    setUser,
    setIsEditing,
    setError
  )
  const { deleting, showDeleteConfirm, setShowDeleteConfirm, handleDelete } =
    useDeleteUser(projectPath, userId, usersListUrl, setError)
  return {
    saving,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleSave,
    handleDelete,
  }
}
