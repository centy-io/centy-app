import type { SortingState } from '@tanstack/react-table'
import type { SortPreset } from './SortPreset'

export function getSortingForPreset(preset: SortPreset): SortingState {
  if (preset === 'name-asc') return [{ id: 'name', desc: false }]
  if (preset === 'name-desc') return [{ id: 'name', desc: true }]
  if (preset === 'projects-desc') return [{ id: 'projectCount', desc: true }]
  return [{ id: 'projectCount', desc: false }]
}
