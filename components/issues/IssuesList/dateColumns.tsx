import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import type { Issue } from '@/gen/centy_pb'

const columnHelper = createColumnHelper<Issue>()

export function createDateColumns(
  lastSeenMap: Record<string, number>
): ColumnDef<Issue, unknown>[] {
  return [
    columnHelper.accessor(row => row.metadata?.createdAt || '', {
      id: 'createdAt',
      header: 'Created',
      cell: info => {
        const date = info.getValue()
        return (
          <span className="issue-date-text">
            {date ? new Date(date).toLocaleDateString() : '-'}
          </span>
        )
      },
      enableColumnFilter: false,
      sortingFn: (rowA, rowB) => {
        const a = rowA.getValue('createdAt') as string
        const b = rowB.getValue('createdAt') as string
        if (!a && !b) return 0
        if (!a) return 1
        if (!b) return -1
        return new Date(a).getTime() - new Date(b).getTime()
      },
    }),
    columnHelper.accessor(row => lastSeenMap[row.id] || 0, {
      id: 'lastSeen',
      header: 'Last Seen',
      cell: info => {
        const timestamp = info.getValue()
        if (!timestamp) {
          return <span className="issue-not-seen">Never</span>
        }
        return (
          <span className="issue-date-text">
            {new Date(timestamp).toLocaleDateString()}
          </span>
        )
      },
      enableColumnFilter: false,
      sortingFn: (rowA, rowB) => {
        const a = rowA.getValue('lastSeen') as number
        const b = rowB.getValue('lastSeen') as number
        if (a === 0 && b === 0) return 0
        if (a === 0) return 1
        if (b === 0) return -1
        return a - b
      },
    }),
  ] as ColumnDef<Issue, unknown>[]
}
