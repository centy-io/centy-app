import { useState, useCallback, useEffect } from 'react'
import { getDraftStorageKey } from '@/hooks/getDraftStorageKey'
import { loadFormDraft } from '@/hooks/loadFormDraft'
import { saveFormDraft } from '@/hooks/saveFormDraft'
import { clearFormDraft } from '@/hooks/clearFormDraft'

interface IssueDraft {
  title: string
  description: string
  priority: number
}

export function useIssueDraft(
  projectPath: string,
  setTitle: (v: string) => void,
  setDescription: (v: string) => void,
  setPriority: (v: number) => void,
  title: string,
  description: string,
  priority: number
) {
  const [draftLoaded, setDraftLoaded] = useState(false)
  const draftKey = projectPath ? getDraftStorageKey('issue', projectPath) : ''

  useEffect(() => {
    if (!draftKey || draftLoaded) return
    const draft = loadFormDraft<IssueDraft>(draftKey)
    if (draft.title !== undefined) setTitle(draft.title)
    if (draft.description !== undefined) setDescription(draft.description)
    if (draft.priority !== undefined) setPriority(draft.priority)
    setDraftLoaded(true)
  }, [draftKey, draftLoaded, setTitle, setDescription, setPriority])

  useEffect(() => {
    if (!draftKey || !draftLoaded) return
    saveFormDraft<IssueDraft>(draftKey, { title, description, priority })
  }, [draftKey, title, description, priority, draftLoaded])

  const clearDraft = useCallback(() => {
    clearFormDraft(draftKey)
  }, [draftKey])

  return { clearDraft }
}
