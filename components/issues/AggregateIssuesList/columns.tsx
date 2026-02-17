import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import type { StateManager } from '@/lib/state'
import type { AggregateIssue } from './AggregateIssuesList.types'
import { getPriorityClass } from './utils'
import { prioritySortingFn, multiSelectFilterFn } from './prioritySorting'

const columnHelper = createColumnHelper<AggregateIssue>()

type LinkCreator = (
  orgSlug: string | null,
  projectName: string,
  path: string
) => RouteLiteral

export function createAggregateColumns(
  stateManager: StateManager,
  createProjectLink: LinkCreator
): ColumnDef<AggregateIssue, unknown>[] {
  return [
    columnHelper.accessor('projectName', {
      header: 'Project',
      cell: info => {
        const issue = info.row.original
        return (
          <Link
            href={createProjectLink(issue.orgSlug, issue.projectName, 'issues')}
            className="project-link"
          >
            {info.getValue()}
          </Link>
        )
      },
      enableColumnFilter: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('displayNumber', {
      header: '#',
      cell: info => `#${info.getValue()}`,
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) =>
        String(row.getValue(columnId) as number).includes(filterValue),
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: info => {
        const issue = info.row.original
        return (
          <Link
            href={createProjectLink(
              issue.orgSlug,
              issue.projectName,
              `issues/${issue.issueNumber}`
            )}
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
      filterFn: multiSelectFilterFn,
      sortingFn: prioritySortingFn,
    }),
  ] as ColumnDef<AggregateIssue, unknown>[]
}
