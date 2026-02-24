import { useState, useCallback, useEffect } from 'react'
import { getDraftStorageKey } from '@/hooks/getDraftStorageKey'
import { loadFormDraft } from '@/hooks/loadFormDraft'
import { saveFormDraft } from '@/hooks/saveFormDraft'
import { clearFormDraft } from '@/hooks/clearFormDraft'

interface DocDraft {
  title: string
  content: string
  slug: string
}

export function useDocDraft(
  projectPath: string,
  setTitle: (v: string) => void,
  setContent: (v: string) => void,
  setSlug: (v: string) => void,
  title: string,
  content: string,
  slug: string
) {
  const [draftLoaded, setDraftLoaded] = useState(false)
  const draftKey = projectPath ? getDraftStorageKey('doc', projectPath) : ''

  useEffect(() => {
    if (!draftKey || draftLoaded) return
    const draft = loadFormDraft<DocDraft>(draftKey)
    if (draft.title !== undefined) setTitle(draft.title)
    if (draft.content !== undefined) setContent(draft.content)
    if (draft.slug !== undefined) setSlug(draft.slug)
    setDraftLoaded(true)
  }, [draftKey, draftLoaded, setTitle, setContent, setSlug])

  useEffect(() => {
    if (!draftKey || !draftLoaded) return
    saveFormDraft<DocDraft>(draftKey, { title, content, slug })
  }, [draftKey, title, content, slug, draftLoaded])

  const clearDraft = useCallback(() => {
    clearFormDraft(draftKey)
  }, [draftKey])

  return { clearDraft }
}
