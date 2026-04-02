import type { SortPreset } from './SortPreset'
import { SORT_SESSION_KEY } from './SORT_SESSION_KEY'
import { isSortPreset } from './isSortPreset'

export function getInitialSortPreset(): SortPreset {
  try {
    const stored = sessionStorage.getItem(SORT_SESSION_KEY)
    if (stored !== null && isSortPreset(stored)) return stored
  } catch {
    // ignore
  }
  return 'name-asc'
}
