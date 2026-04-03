'use client'

export function saveFormDraft(storageKey: string, values: unknown): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(storageKey, JSON.stringify(values))
  } catch {
    // ignore storage errors
  }
}
