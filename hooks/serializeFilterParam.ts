import type { ColumnFiltersState } from '@tanstack/react-table'

export function serializeFilterParam(
  filters: ColumnFiltersState
): string | null {
  if (!filters.length) return null
  const mql = Object.fromEntries(
    filters.map(({ id, value }) => [
      id,
      Array.isArray(value) ? { $in: value } : value,
    ])
  )
  return JSON.stringify(mql)
}
