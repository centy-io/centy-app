import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppLink } from '@/hooks/useAppLink'
import type { UseDocActionsParams } from '../DocDetail.types'
import { saveDoc } from './saveDocApi'
import { deleteDoc } from './deleteDocApi'

export function useDocActions({
  projectPath,
  slug,
  editTitle,
  editContent,
  editSlug,
  doc,
  setDoc,
  setError,
  setIsEditing,
  setEditTitle,
  setEditContent,
  setEditSlug,
  setShowDeleteConfirm,
  docsListUrl,
}: UseDocActionsParams) {
  const router = useRouter()
  const { createLink } = useAppLink()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSave = useCallback(
    async () =>
      saveDoc({
        projectPath,
        slug,
        editTitle,
        editContent,
        editSlug,
        setDoc,
        setError,
        setIsEditing,
        setSaving,
        router,
        createLink,
      }),
    [
      projectPath,
      slug,
      editTitle,
      editContent,
      editSlug,
      router,
      createLink,
      setDoc,
      setError,
      setIsEditing,
    ]
  )

  const handleDelete = useCallback(
    async () =>
      deleteDoc({
        projectPath,
        slug,
        setError,
        setDeleting,
        setShowDeleteConfirm,
        router,
        docsListUrl,
      }),
    [projectPath, slug, router, docsListUrl, setError, setShowDeleteConfirm]
  )

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    if (doc) {
      setEditTitle(doc.title)
      setEditContent(doc.content)
      setEditSlug('')
    }
  }, [doc, setIsEditing, setEditTitle, setEditContent, setEditSlug])

  return {
    saving,
    deleting,
    handleSave,
    handleDelete,
    handleCancelEdit,
  }
}
