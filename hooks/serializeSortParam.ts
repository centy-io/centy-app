import type { SortingState } from '@tanstack/react-table'

export function serializeSortParam(sorting: SortingState): string | null {
  if (!sorting.length) return null
  return sorting
    .map(({ id, desc }) => `${id}:${desc ? 'desc' : 'asc'}`)
    .join(',')
}
