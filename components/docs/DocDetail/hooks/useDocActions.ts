import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateDocRequestSchema, DeleteDocRequestSchema } from '@/gen/centy_pb'
import { useAppLink } from '@/hooks/useAppLink'
import type { UseDocActionsParams } from '../DocDetail.types'

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

  const handleSave = useCallback(async () => {
    if (!projectPath || !slug) return
    setSaving(true)
    setError(null)
    try {
      const request = create(UpdateDocRequestSchema, {
        projectPath,
        slug,
        title: editTitle,
        content: editContent,
        newSlug: editSlug || undefined,
      })
      const response = await centyClient.updateDoc(request)
      if (response.success && response.doc) {
        setDoc(response.doc)
        setIsEditing(false)
        if (editSlug && editSlug !== slug) {
          router.replace(createLink(`/docs/${editSlug}`))
        }
      } else {
        setError(response.error || 'Failed to update document')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setSaving(false)
    }
  }, [
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
  ])

  const handleDelete = useCallback(async () => {
    if (!projectPath || !slug) return
    setDeleting(true)
    setError(null)
    try {
      const request = create(DeleteDocRequestSchema, { projectPath, slug })
      const response = await centyClient.deleteDoc(request)
      if (response.success) {
        router.push(docsListUrl)
      } else {
        setError(response.error || 'Failed to delete document')
        setShowDeleteConfirm(false)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }, [projectPath, slug, router, docsListUrl, setError, setShowDeleteConfirm])

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
