'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { create } from '@bufbuild/protobuf'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { centyClient } from '@/lib/grpc/client'
import { ListIssuesRequestSchema, type Issue } from '@/gen/centy_pb'
import { getProjects } from '@/lib/project-resolver'
import { useAppLink } from '@/hooks/useAppLink'
import { useStateManager } from '@/lib/state'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import {
  MultiSelect,
  type MultiSelectOption,
} from '@/components/shared/MultiSelect'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

const PRIORITY_OPTIONS: MultiSelectOption[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

interface AggregateIssue extends Issue {
  projectName: string
  orgSlug: string | null
  projectPath: string
}

const columnHelper = createColumnHelper<AggregateIssue>()

const getPriorityClass = (priorityLabel: string): string => {
  switch (priorityLabel.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'priority-high'
    case 'medium':
    case 'normal':
      return 'priority-medium'
    case 'low':
      return 'priority-low'
  }
  if (priorityLabel.startsWith('P') || priorityLabel.startsWith('p')) {
    const num = parseInt(priorityLabel.slice(1))
    if (num === 1) return 'priority-high'
    if (num === 2) return 'priority-medium'
    return 'priority-low'
  }
  return ''
}

type CreateProjectLinkFn = (
  orgSlug: string | null,
  projectName: string,
  path: string
) => string

const AGG_PRIORITY_ORDER: Record<string, number> = {
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

const aggMultiSelectFilter = (
  row: { getValue: (id: string) => unknown },
  columnId: string,
  filterValue: unknown
) => {
  const val = String(row.getValue(columnId))
  const selected = Array.isArray(filterValue) ? filterValue : []
  if (selected.length === 0) return true
  return selected.includes(val)
}

const aggPriorityMultiSelectFilter = (
  row: { getValue: (id: string) => unknown },
  columnId: string,
  filterValue: unknown
) => {
  const priority = String(row.getValue(columnId)).toLowerCase()
  const selected = Array.isArray(filterValue) ? filterValue : []
  if (selected.length === 0) return true
  return selected.includes(priority)
}

function buildAggregateIdColumns(createProjectLink: CreateProjectLinkFn) {
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
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId)
        return String(value).includes(filterValue)
      },
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
  ]
}

function buildAggregateMetaColumns(
  stateManager: ReturnType<typeof useStateManager>
) {
  return [
    columnHelper.accessor(
      row => (row.metadata && row.metadata.status) || 'unknown',
      {
        id: 'status',
        header: 'Status',
        cell: info => (
          <span
            className={`status-badge ${stateManager.getStateClass(info.getValue())}`}
          >
            {info.getValue()}
          </span>
        ),
        enableColumnFilter: true,
        filterFn: aggMultiSelectFilter,
      }
    ),
    columnHelper.accessor(
      row => (row.metadata && row.metadata.priorityLabel) || 'unknown',
      {
        id: 'priority',
        header: 'Priority',
        cell: info => (
          <span
            className={`priority-badge ${getPriorityClass(info.getValue())}`}
          >
            {info.getValue()}
          </span>
        ),
        enableColumnFilter: true,
        filterFn: aggPriorityMultiSelectFilter,
        sortingFn: (rowA, rowB) => {
          const a = String(rowA.getValue('priority')).toLowerCase()
          const b = String(rowB.getValue('priority')).toLowerCase()
          return (AGG_PRIORITY_ORDER[a] || 4) - (AGG_PRIORITY_ORDER[b] || 4)
        },
      }
    ),
    columnHelper.accessor(
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
    ),
  ]
}

function buildAggregateColumns(
  stateManager: ReturnType<typeof useStateManager>,
  createProjectLink: CreateProjectLinkFn
) {
  return [
    ...buildAggregateIdColumns(createProjectLink),
    ...buildAggregateMetaColumns(stateManager),
  ]
}

function getAggregateCellClassName(columnId: string) {
  if (columnId === 'displayNumber') return 'issue-number'
  if (columnId === 'title') return 'issue-title'
  if (columnId === 'createdAt') return 'issue-date'
  if (columnId === 'projectName') return 'project-name'
  return ''
}

function AggregateColumnFilter({
  columnId,
  filterValue,
  setFilterValue,
  statusOptions,
}: {
  columnId: string
  filterValue: unknown
  setFilterValue: (val: unknown) => void
  statusOptions: MultiSelectOption[]
}) {
  if (columnId === 'status') {
    return (
      <MultiSelect
        options={statusOptions}
        value={(() => {
          const filterVal = filterValue
          return Array.isArray(filterVal)
            ? filterVal.filter((v): v is string => typeof v === 'string')
            : []
        })()}
        onChange={values =>
          setFilterValue(values.length > 0 ? values : undefined)
        }
        placeholder="All"
        className="column-filter-multi"
      />
    )
  }
  if (columnId === 'priority') {
    return (
      <MultiSelect
        options={PRIORITY_OPTIONS}
        value={(() => {
          const filterVal = filterValue
          return Array.isArray(filterVal)
            ? filterVal.filter((v): v is string => typeof v === 'string')
            : []
        })()}
        onChange={values =>
          setFilterValue(values.length > 0 ? values : undefined)
        }
        placeholder="All"
        className="column-filter-multi"
      />
    )
  }
  return (
    <input
      type="text"
      className="column-filter"
      placeholder="Filter..."
      value={(() => {
        const filterVal = filterValue
        return typeof filterVal === 'string' ? filterVal : ''
      })()}
      onChange={e => setFilterValue(e.target.value)}
    />
  )
}

function getAggregateSortIndicator(sorted: false | 'asc' | 'desc') {
  if (sorted === 'asc') return ' \u25B2'
  if (sorted === 'desc') return ' \u25BC'
  return ''
}

function AggregateTableView({
  table,
  statusOptions,
}: {
  table: ReturnType<typeof useReactTable<AggregateIssue>>
  statusOptions: MultiSelectOption[]
}) {
  return (
    <div className="issues-table">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  <div className="th-content">
                    <button
                      type="button"
                      className={`sort-btn ${header.column.getIsSorted() ? 'sorted' : ''}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="sort-indicator">
                        {getAggregateSortIndicator(header.column.getIsSorted())}
                      </span>
                    </button>
                    {header.column.getCanFilter() && (
                      <AggregateColumnFilter
                        columnId={header.column.id}
                        filterValue={header.column.getFilterValue()}
                        setFilterValue={header.column.setFilterValue}
                        statusOptions={statusOptions}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={`${row.original.projectPath}-${row.original.issueNumber}`}>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className={getAggregateCellClassName(cell.column.id)}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function getOrgDisplayName(
  selectedOrgSlug: string | null,
  organizations: { slug: string; name?: string }[]
) {
  if (selectedOrgSlug === null) return 'All Issues'
  if (selectedOrgSlug === '') return 'Ungrouped Issues'
  const org = organizations.find(o => o.slug === selectedOrgSlug)
  return org && org.name ? `${org.name} Issues` : `${selectedOrgSlug} Issues`
}

function getOrgName(
  selectedOrgSlug: string | null,
  organizations: { slug: string; name?: string }[]
) {
  if (selectedOrgSlug === null || selectedOrgSlug === '') return ''
  const found = organizations.find(o => o.slug === selectedOrgSlug)
  return found ? found.name : ''
}

function AggregateNote({
  selectedOrgSlug,
  organizations,
}: {
  selectedOrgSlug: string | null
  organizations: { slug: string; name?: string }[]
}) {
  if (selectedOrgSlug === null) {
    return (
      <p className="aggregate-note">
        Showing issues from all projects. Select a project to create new issues.
      </p>
    )
  }
  if (selectedOrgSlug === '') {
    return (
      <p className="aggregate-note">
        Showing issues from ungrouped projects. Select a project to create new
        issues.
      </p>
    )
  }
  const orgName = getOrgName(selectedOrgSlug, organizations) || selectedOrgSlug
  return (
    <p className="aggregate-note">
      {`Showing issues from ${orgName} organization. Select a project to create new issues.`}
    </p>
  )
}

function AggregateEmptyState({
  selectedOrgSlug,
  organizations,
}: {
  selectedOrgSlug: string | null
  organizations: { slug: string; name?: string }[]
}) {
  let message: string
  if (selectedOrgSlug === null) {
    message = 'No issues found across any projects'
  } else if (selectedOrgSlug === '') {
    message = 'No issues found in ungrouped projects'
  } else {
    const orgName =
      getOrgName(selectedOrgSlug, organizations) || selectedOrgSlug
    message = `No issues found in ${orgName} organization`
  }
  return (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  )
}

function useFetchAllIssues(
  setIssues: (i: AggregateIssue[]) => void,
  setLoading: (l: boolean) => void,
  setError: (e: string | null) => void
) {
  return useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const projects = await getProjects()
      const initializedProjects = projects.filter(p => p.initialized)

      const issuePromises = initializedProjects.map(async project => {
        try {
          const request = create(ListIssuesRequestSchema, {
            projectPath: project.path,
          })
          const response = await centyClient.listIssues(request)
          return response.issues.map(issue => ({
            ...issue,
            projectName: project.name,
            orgSlug: project.organizationSlug || null,
            projectPath: project.path,
          }))
        } catch {
          console.warn(`Failed to fetch issues from ${project.name}`)
          return []
        }
      })

      const issueArrays = await Promise.all(issuePromises)
      setIssues(issueArrays.flat())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch issues')
    } finally {
      setLoading(false)
    }
  }, [setIssues, setLoading, setError])
}

function useAggregateIssuesListState() {
  const stateManager = useStateManager()
  const { createProjectLink } = useAppLink()
  const { selectedOrgSlug, organizations } = useOrganization()
  const [issues, setIssues] = useState<AggregateIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([
    { id: 'createdAt', desc: true },
  ])
  const [columnFilters, setColumnFilters] = useState<
    { id: string; value: unknown }[]
  >([])

  const filteredIssues = useMemo(() => {
    if (selectedOrgSlug === null) return issues
    if (selectedOrgSlug === '') return issues.filter(issue => !issue.orgSlug)
    return issues.filter(issue => issue.orgSlug === selectedOrgSlug)
  }, [issues, selectedOrgSlug])

  const statusOptions: MultiSelectOption[] = useMemo(
    () =>
      stateManager
        .getStateOptions()
        .map(opt => ({ value: opt.value, label: opt.label })),
    [stateManager]
  )

  const columns = useMemo(
    () => buildAggregateColumns(stateManager, createProjectLink),
    [stateManager, createProjectLink]
  )

  const table = useReactTable({
    data: filteredIssues,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const fetchAllIssues = useFetchAllIssues(setIssues, setLoading, setError)

  useEffect(() => {
    fetchAllIssues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    selectedOrgSlug,
    organizations,
    loading,
    error,
    filteredIssues,
    table,
    statusOptions,
    fetchAllIssues,
  }
}

export function AggregateIssuesList() {
  const state = useAggregateIssuesListState()

  return (
    <div className="issues-list">
      <div className="issues-header">
        <h2>{getOrgDisplayName(state.selectedOrgSlug, state.organizations)}</h2>
        <div className="header-actions">
          <button
            onClick={state.fetchAllIssues}
            disabled={state.loading}
            className="refresh-btn"
          >
            {state.loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <AggregateNote
        selectedOrgSlug={state.selectedOrgSlug}
        organizations={state.organizations}
      />

      {state.error && <DaemonErrorMessage error={state.error} />}

      {state.loading && state.filteredIssues.length === 0 ? (
        <div className="loading">Loading issues...</div>
      ) : state.filteredIssues.length === 0 ? (
        <AggregateEmptyState
          selectedOrgSlug={state.selectedOrgSlug}
          organizations={state.organizations}
        />
      ) : (
        <AggregateTableView
          table={state.table}
          statusOptions={state.statusOptions}
        />
      )}
    </div>
  )
}
