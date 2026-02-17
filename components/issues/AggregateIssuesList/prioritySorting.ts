import type { Row } from '@tanstack/react-table'

const PRIORITY_ORDER: Record<string, number> = {
  high: 1,
  critical: 1,
  p1: 1,
  medium: 2,
  normal: 2,
  p2: 2,
  low: 3,
  p3: 3,
  unknown: 4,
}

export function prioritySortingFn<T>(rowA: Row<T>, rowB: Row<T>): number {
  const a = (rowA.getValue('priority') as string).toLowerCase()
  const b = (rowB.getValue('priority') as string).toLowerCase()
  return (PRIORITY_ORDER[a] || 4) - (PRIORITY_ORDER[b] || 4)
}

export function multiSelectFilterFn<T>(
  row: Row<T>,
  columnId: string,
  filterValue: unknown
): boolean {
  const selected = filterValue as string[]
  if (!selected || selected.length === 0) return true
  return selected.includes((row.getValue(columnId) as string).toLowerCase())
}
