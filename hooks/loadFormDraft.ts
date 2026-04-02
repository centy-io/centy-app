'use client'

export function loadFormDraft<T>(storageKey: string): Partial<T> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}
