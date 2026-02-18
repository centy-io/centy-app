import { createColumnHelper } from '@tanstack/react-table'
import type { Issue } from '@/gen/centy_pb'

const columnHelper = createColumnHelper<Issue>()

export function createCreatedAtColumn() {
  return columnHelper.accessor(
    row => (row.metadata && row.metadata.createdAt) || '',
    {
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
        const a = String(rowA.getValue('createdAt'))
        const b = String(rowB.getValue('createdAt'))
        if (!a && !b) return 0
        if (!a) return 1
        if (!b) return -1
        return new Date(a).getTime() - new Date(b).getTime()
      },
    }
  )
}

export function createLastSeenColumn(lastSeenMap: Record<string, number>) {
  return columnHelper.accessor(row => lastSeenMap[row.id] || 0, {
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
      const a = Number(rowA.getValue('lastSeen'))
      const b = Number(rowB.getValue('lastSeen'))
      if (a === 0 && b === 0) return 0
      if (a === 0) return 1
      if (b === 0) return -1
      return a - b
    },
  })
}
