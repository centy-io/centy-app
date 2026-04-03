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

interface IssueDraftState {
  title: string
  setTitle: (v: string) => void
  description: string
  setDescription: (v: string) => void
  priority: number
  setPriority: (v: number) => void
  clearDraft: () => void
}

export function useIssueDraft(projectPath: string): IssueDraftState {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState(2)
  const [draftLoaded, setDraftLoaded] = useState(false)

  const draftKey = projectPath ? getDraftStorageKey('issue', projectPath) : ''

  useEffect(() => {
    if (!draftKey || draftLoaded) return
    const draft = loadFormDraft<IssueDraft>(draftKey)
    if (draft.title !== undefined) setTitle(draft.title)
    if (draft.description !== undefined) setDescription(draft.description)
    if (draft.priority !== undefined) setPriority(draft.priority)
    setDraftLoaded(true)
  }, [draftKey, draftLoaded])

  useEffect(() => {
    if (!draftKey || !draftLoaded) return
    saveFormDraft(draftKey, { title, description, priority })
  }, [draftKey, title, description, priority, draftLoaded])

  const clearDraft = useCallback(() => {
    clearFormDraft(draftKey)
  }, [draftKey])

  return {
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    clearDraft,
  }
}
