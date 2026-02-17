import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import type { Issue } from '@/gen/centy_pb'
import type { StateManager } from '@/lib/state'
import { getPriorityClass } from './utils'

const columnHelper = createColumnHelper<Issue>()

export function createIssueColumns(
  stateManager: StateManager
): ColumnDef<Issue, unknown>[] {
  return [
    columnHelper.accessor('displayNumber', {
      header: '#',
      cell: info => {
        const issueId = info.row.original.issueNumber
        const meta = info.table.options.meta as {
          copyToClipboard: (text: string, label?: string) => Promise<boolean>
        }
        return (
          <button
            type="button"
            className="issue-number-copy-btn"
            onClick={e => {
              e.stopPropagation()
              meta?.copyToClipboard(issueId, `issue #${info.getValue()}`)
            }}
            title="Click to copy UUID"
          >
            #{info.getValue()}
          </button>
        )
      },
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) =>
        String(row.getValue(columnId) as number).includes(filterValue),
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: info => {
        const meta = info.table.options.meta as {
          createLink: (path: string) => RouteLiteral
        }
        return (
          <Link
            href={meta.createLink(`/issues/${info.row.original.issueNumber}`)}
            className="issue-title-link"
          >
            {info.getValue()}
          </Link>
        )
      },
      enableColumnFilter: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor(row => row.metadata?.status || 'unknown', {
      id: 'status',
      header: 'Status',
      cell: info => {
        const s = info.getValue()
        return (
          <span className={`status-badge ${stateManager.getStateClass(s)}`}>
            {s}
          </span>
        )
      },
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        const selected = filterValue as string[]
        if (!selected || selected.length === 0) return true
        return selected.includes(row.getValue(columnId) as string)
      },
    }),
    columnHelper.accessor(row => row.metadata?.priorityLabel || 'unknown', {
      id: 'priority',
      header: 'Priority',
      cell: info => {
        const p = info.getValue()
        return (
          <span className={`priority-badge ${getPriorityClass(p)}`}>{p}</span>
        )
      },
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        const selected = filterValue as string[]
        if (!selected || selected.length === 0) return true
        return selected.includes(
          (row.getValue(columnId) as string).toLowerCase()
        )
      },
      sortingFn: (rowA, rowB) => {
        const order: Record<string, number> = {
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
        const a = (rowA.getValue('priority') as string).toLowerCase()
        const b = (rowB.getValue('priority') as string).toLowerCase()
        return (order[a] || 4) - (order[b] || 4)
      },
    }),
  ] as ColumnDef<Issue, unknown>[]
}
