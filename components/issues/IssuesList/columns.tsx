import Link from 'next/link'
import { createColumnHelper } from '@tanstack/react-table'
import type { RouteLiteral } from 'nextjs-routes'
import type { Issue } from '@/gen/centy_pb'

const columnHelper = createColumnHelper<Issue>()

export function createBaseColumns(
  copyToClipboard: (text: string, label: string) => void,
  createLink: (path: string) => RouteLiteral,
  stateManager: { getStateClass: (status: string) => string }
) {
  return [
    columnHelper.accessor('displayNumber', {
      header: '#',
      cell: info => {
        const issueId = info.row.original.issueNumber
        return (
          <button
            type="button"
            className="issue-number-copy-btn"
            onClick={e => {
              e.stopPropagation()
              void copyToClipboard(issueId, `issue #${info.getValue()}`)
            }}
            title="Click to copy UUID"
          >
            #{info.getValue()}
          </button>
        )
      },
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId)
        return String(value).includes(filterValue)
      },
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: info => (
        <Link
          href={createLink(`/issues/${info.row.original.issueNumber}`)}
          className="issue-title-link"
        >
          {info.getValue()}
        </Link>
      ),
      enableColumnFilter: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor(
      row => (row.metadata && row.metadata.status) || 'unknown',
      {
        id: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue()
          return (
            <span
              className={`status-badge ${stateManager.getStateClass(status)}`}
            >
              {status}
            </span>
          )
        },
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          const status = String(row.getValue(columnId))
          const selectedValues = Array.isArray(filterValue) ? filterValue : []
          if (selectedValues.length === 0) return true
          return selectedValues.includes(status)
        },
      }
    ),
  ]
}
