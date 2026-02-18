import { createColumnHelper } from '@tanstack/react-table'
import type { Issue } from '@/gen/centy_pb'
import { getPriorityClass } from './IssuesList.types'

const columnHelper = createColumnHelper<Issue>()

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

export function createPriorityColumn() {
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
        const a = String(rowA.getValue('priority')).toLowerCase()
        const b = String(rowB.getValue('priority')).toLowerCase()
        return (PRIORITY_ORDER[a] || 4) - (PRIORITY_ORDER[b] || 4)
      },
    }
  )
}
