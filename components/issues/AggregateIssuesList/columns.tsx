import Link from 'next/link'
import { createColumnHelper } from '@tanstack/react-table'
import type { RouteLiteral } from 'nextjs-routes'
import type { AggregateIssue } from './AggregateIssuesList.types'

const columnHelper = createColumnHelper<AggregateIssue>()

type CreateProjectLink = (
  orgSlug: string | null,
  projectName: string,
  path: string
) => RouteLiteral

interface StateManager {
  getStateClass: (status: string) => string
}

function makeProjectColumn(createProjectLink: CreateProjectLink) {
  return columnHelper.accessor('projectName', {
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
  })
}

function makeTitleColumn(createProjectLink: CreateProjectLink) {
  return columnHelper.accessor('title', {
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
  })
}

function makeStatusColumn(stateManager: StateManager) {
  return columnHelper.accessor(
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
  )
}

export function createAggregateColumns(
  stateManager: StateManager,
  createProjectLink: CreateProjectLink
) {
  return [
    makeProjectColumn(createProjectLink),
    columnHelper.accessor('displayNumber', {
      header: '#',
      cell: info => `#${info.getValue()}`,
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId)
        return String(value).includes(filterValue)
      },
    }),
    makeTitleColumn(createProjectLink),
    makeStatusColumn(stateManager),
  ]
}
