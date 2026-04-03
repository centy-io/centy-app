import type { ColumnFiltersState } from '@tanstack/react-table'
import { DEFAULT_SETTINGS } from './useIssueTableSettings.types'

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null
}

export function parseFilterParam(value: string | null): ColumnFiltersState {
  if (!value) return DEFAULT_SETTINGS.columnFilters
  try {
    const mql: unknown = JSON.parse(value)
    if (!isRecord(mql)) return DEFAULT_SETTINGS.columnFilters
    return Object.entries(mql).map(([id, condition]) => {
      if (isRecord(condition) && '$in' in condition) {
        return { id, value: condition.$in }
      }
      return { id, value: condition }
    })
  } catch {
    return DEFAULT_SETTINGS.columnFilters
  }
}
