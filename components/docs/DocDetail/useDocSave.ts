import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateDocRequestSchema, type Doc } from '@/gen/centy_pb'
import { useAppLink } from '@/hooks/useAppLink'

interface UseDocSaveParams {
  projectPath: string
  slug: string
  editTitle: string
  editContent: string
  editSlug: string
  setDoc: (doc: Doc) => void
  setIsEditing: (editing: boolean) => void
  setError: (error: string | null) => void
}

export function useDocSave({
  projectPath,
  slug,
  editTitle,
  editContent,
  editSlug,
  setDoc,
  setIsEditing,
  setError,
}: UseDocSaveParams) {
  const router = useRouter()
  const { createLink } = useAppLink()
  const [saving, setSaving] = useState(false)

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
    setIsEditing,
    setError,
  ])

  return { saving, handleSave }
}
