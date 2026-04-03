'use client'

export function loadFormDraft<T>(storageKey: string): Partial<T> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(storageKey)
    if (!stored) return {}
    const draft: Partial<T> = JSON.parse(stored)
    return draft
  } catch {
    return {}
  }
}
