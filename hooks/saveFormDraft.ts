'use client'

export function saveFormDraft<T>(storageKey: string, values: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(storageKey, JSON.stringify(values))
  } catch {
    // ignore storage errors
  }
}
