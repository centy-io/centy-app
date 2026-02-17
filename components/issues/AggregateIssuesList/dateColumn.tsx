import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import type { AggregateIssue } from './AggregateIssuesList.types'

const columnHelper = createColumnHelper<AggregateIssue>()

export function createDateColumn(): ColumnDef<AggregateIssue, unknown> {
  return columnHelper.accessor(row => row.metadata?.createdAt || '', {
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
  }) as ColumnDef<AggregateIssue, unknown>
}
