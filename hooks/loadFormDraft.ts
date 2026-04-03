'use client'

export function loadFormDraft<T>(storageKey: string): Partial<T> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(storageKey)
    if (!stored) return {}
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const draft: Partial<T> = JSON.parse(stored)
    return draft
  } catch {
    return {}
  }
}
