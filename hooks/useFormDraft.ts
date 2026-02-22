'use client'

export function getDraftStorageKey(type: string, projectPath: string): string {
  return `centy-draft-${type}-${projectPath}`
}

export function loadFormDraft<T>(storageKey: string): Partial<T> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export function saveFormDraft<T>(storageKey: string, values: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(storageKey, JSON.stringify(values))
  } catch {
    // ignore storage errors
  }
}

export function clearFormDraft(storageKey: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(storageKey)
  } catch {
    // ignore storage errors
  }
}
