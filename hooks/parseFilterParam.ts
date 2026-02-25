import type { ColumnFiltersState } from '@tanstack/react-table'
import { DEFAULT_SETTINGS } from './useIssueTableSettings.types'

export function parseFilterParam(value: string | null): ColumnFiltersState {
  if (!value) return DEFAULT_SETTINGS.columnFilters
  try {
    const mql = JSON.parse(value)
    return Object.entries(mql).map(([id, condition]) => {
      if (
        typeof condition === 'object' &&
        condition !== null &&
        '$in' in condition
      ) {
        return { id, value: condition.$in }
      }
      return { id, value: condition }
    })
  } catch {
    return DEFAULT_SETTINGS.columnFilters
  }
}
