'use client'

export function clearFormDraft(storageKey: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(storageKey)
  } catch {
    // ignore storage errors
  }
}
