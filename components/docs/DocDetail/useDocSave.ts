import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateItemRequestSchema, type Doc } from '@/gen/centy_pb'
import { genericItemToDoc } from '@/lib/genericItemToDoc'
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
      const request = create(UpdateItemRequestSchema, {
        projectPath,
        itemType: 'docs',
        itemId: slug,
        title: editTitle,
        body: editContent,
      })
      const response = await centyClient.updateItem(request)

      if (response.success && response.item) {
        const doc = genericItemToDoc(response.item)
        setDoc(doc)
        setIsEditing(false)
        if (editSlug && editSlug !== slug) {
          router.replace(createLink(`/docs/${doc.slug}`))
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
