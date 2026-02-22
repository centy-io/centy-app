import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { CreateDocRequestSchema } from '@/gen/centy_pb'
import {
  getDraftStorageKey,
  loadFormDraft,
  saveFormDraft,
  clearFormDraft,
} from '@/hooks/useFormDraft'
import { useCreateItemSubmit } from '@/hooks/useCreateItemSubmit'

interface UseCreateDocParams {
  projectPath: string
  getProjectContext: () => Promise<{
    organization: string
    project: string
  } | null>
}

interface DocDraft {
  title: string
  content: string
  slug: string
}

export function useCreateDoc({
  projectPath,
  getProjectContext,
}: UseCreateDocParams) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draftLoaded, setDraftLoaded] = useState(false)

  const draftKey = projectPath ? getDraftStorageKey('doc', projectPath) : ''

  // Load draft from localStorage when projectPath becomes available
  useEffect(() => {
    if (!draftKey || draftLoaded) return
    const draft = loadFormDraft<DocDraft>(draftKey)
    if (draft.title !== undefined) setTitle(draft.title)
    if (draft.content !== undefined) setContent(draft.content)
    if (draft.slug !== undefined) setSlug(draft.slug)
    setDraftLoaded(true)
  }, [draftKey, draftLoaded])

  // Auto-save draft on field changes
  useEffect(() => {
    if (!draftKey || !draftLoaded) return
    saveFormDraft<DocDraft>(draftKey, { title, content, slug })
  }, [draftKey, title, content, slug, draftLoaded])

  const clearDraft = useCallback(() => {
    clearFormDraft(draftKey)
  }, [draftKey])

  const { submitItem, handleCancel } = useCreateItemSubmit({
    kind: 'doc',
    projectPath,
    getProjectContext,
    setLoading,
    setError,
    clearDraft,
  })

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      if (!title.trim()) return
      return submitItem(
        () =>
          centyClient.createDoc(
            create(CreateDocRequestSchema, {
              projectPath: projectPath.trim(),
              title: title.trim(),
              content: content.trim(),
              slug: slug.trim() || undefined,
            })
          ),
        e
      )
    },
    [projectPath, title, content, slug, submitItem]
  )

  return {
    title,
    setTitle,
    content,
    setContent,
    slug,
    setSlug,
    loading,
    error,
    handleSubmit,
    handleCancel,
  }
}
