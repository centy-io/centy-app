import type { SortPreset } from './SortPreset'

export function isSortPreset(value: string): value is SortPreset {
  return (
    value === 'name-asc' ||
    value === 'name-desc' ||
    value === 'projects-desc' ||
    value === 'projects-asc'
  )
}
