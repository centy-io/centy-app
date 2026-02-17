import type { Dispatch, SetStateAction } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateDocRequestSchema, type Doc } from '@/gen/centy_pb'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface SaveDocParams {
  projectPath: string
  slug: string
  editTitle: string
  editContent: string
  editSlug: string
  setDoc: Dispatch<SetStateAction<Doc | null>>
  setError: Dispatch<SetStateAction<string | null>>
  setIsEditing: (v: boolean) => void
  setSaving: (v: boolean) => void
  router: AppRouterInstance
  createLink: (path: string) => string
}

export async function saveDoc(params: SaveDocParams) {
  const {
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
  } = params
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
    setError(err instanceof Error ? err.message : 'Failed to connect to daemon')
  } finally {
    setSaving(false)
  }
}
