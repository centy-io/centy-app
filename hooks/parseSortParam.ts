import type { SortingState } from '@tanstack/react-table'
import { DEFAULT_SETTINGS } from './useIssueTableSettings.types'

export function parseSortParam(value: string | null): SortingState {
  if (!value) return DEFAULT_SETTINGS.sorting
  return value.split(',').map(part => {
    const [id, dir] = part.split(':')
    return { id, desc: dir === 'desc' }
  })
}
