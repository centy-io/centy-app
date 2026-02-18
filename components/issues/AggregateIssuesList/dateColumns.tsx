import { createColumnHelper } from '@tanstack/react-table'
import type { AggregateIssue } from './AggregateIssuesList.types'
import { getPriorityClass } from './utils'

const columnHelper = createColumnHelper<AggregateIssue>()

export function createPriorityColumn(stateManager: {
  getStateClass: (status: string) => string
}) {
  return columnHelper.accessor(
    row => (row.metadata && row.metadata.priorityLabel) || 'unknown',
    {
      id: 'priority',
      header: 'Priority',
      cell: info => {
        const priority = info.getValue()
        return (
          <span className={`priority-badge ${getPriorityClass(priority)}`}>
            {priority}
          </span>
        )
      },
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        const priority = String(row.getValue(columnId)).toLowerCase()
        const selectedValues = Array.isArray(filterValue) ? filterValue : []
        if (selectedValues.length === 0) return true
        return selectedValues.includes(priority)
      },
      sortingFn: (rowA, rowB) => {
        const priorityOrder: Record<string, number> = {
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
        const a = String(rowA.getValue('priority')).toLowerCase()
        const b = String(rowB.getValue('priority')).toLowerCase()
        // eslint-disable-next-line security/detect-object-injection
        return (priorityOrder[a] || 4) - (priorityOrder[b] || 4)
      },
    }
  )
}

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
