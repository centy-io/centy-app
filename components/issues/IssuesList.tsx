'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { RouteLiteral } from 'nextjs-routes'
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
import {
  usePathContext,
  useProjectPathToUrl,
} from '@/components/providers/PathContextProvider'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useAppLink } from '@/hooks/useAppLink'
import { useLastSeenIssues } from '@/hooks/useLastSeenIssues'
import { useIssueTableSettings } from '@/hooks/useIssueTableSettings'
import { usePinnedItems } from '@/hooks/usePinnedItems'
import { useStateManager } from '@/lib/state'
import {
  MultiSelect,
  type MultiSelectOption,
} from '@/components/shared/MultiSelect'
import {
  ContextMenu,
  type ContextMenuItem,
} from '@/components/shared/ContextMenu'
import { MoveModal } from '@/components/shared/MoveModal'
import { DuplicateModal } from '@/components/shared/DuplicateModal'
import { StandaloneWorkspaceModal } from '@/components/shared/StandaloneWorkspaceModal'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

const PRIORITY_OPTIONS: MultiSelectOption[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const columnHelper = createColumnHelper<Issue>()

const getPriorityClass = (priorityLabel: string) => {
  switch (priorityLabel.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'priority-high'
    case 'medium':
    case 'normal':
      return 'priority-medium'
    case 'low':
      return 'priority-low'
    default:
      // Handle P1, P2, etc. format
      if (priorityLabel.startsWith('P') || priorityLabel.startsWith('p')) {
        const num = parseInt(priorityLabel.slice(1))
        if (num === 1) return 'priority-high'
        if (num === 2) return 'priority-medium'
        return 'priority-low'
      }
      return ''
  }
}

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

const multiSelectFilterFn = (
  row: { getValue: (id: string) => unknown },
  columnId: string,
  filterValue: unknown
) => {
  const val = (row.getValue(columnId) as string).toLowerCase()
  const selected = filterValue as string[]
  if (!selected || selected.length === 0) return true
  return selected.includes(val)
}

const prioritySortFn = (
  rowA: { getValue: (id: string) => unknown },
  rowB: { getValue: (id: string) => unknown }
) => {
  const a = (rowA.getValue('priority') as string).toLowerCase()
  const b = (rowB.getValue('priority') as string).toLowerCase()
  return (PRIORITY_ORDER[a] || 4) - (PRIORITY_ORDER[b] || 4)
}

const dateSortFn = (
  rowA: { getValue: (id: string) => unknown },
  rowB: { getValue: (id: string) => unknown }
) => {
  const a = rowA.getValue('createdAt') as string
  const b = rowB.getValue('createdAt') as string
  if (!a && !b) return 0
  if (!a) return 1
  if (!b) return -1
  return new Date(a).getTime() - new Date(b).getTime()
}

function buildIdAndTitleColumns() {
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
              if (meta)
                meta.copyToClipboard(issueId, `issue #${info.getValue()}`)
            }}
            title="Click to copy UUID"
          >
            #{info.getValue()}
          </button>
        )
      },
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as number
        return String(value).includes(filterValue)
      },
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
  ]
}

const lastSeenSortFn = (
  rowA: { getValue: (id: string) => unknown },
  rowB: { getValue: (id: string) => unknown }
) => {
  const a = rowA.getValue('lastSeen') as number
  const b = rowB.getValue('lastSeen') as number
  if (a === 0 && b === 0) return 0
  if (a === 0) return 1
  if (b === 0) return -1
  return a - b
}

function buildStatusAndPriorityColumns(
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
        filterFn: multiSelectFilterFn,
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
        filterFn: multiSelectFilterFn,
        sortingFn: prioritySortFn,
      }
    ),
  ]
}

function buildDateAndLastSeenColumns(lastSeenMap: Record<string, number>) {
  return [
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
        sortingFn: dateSortFn,
      }
    ),
    columnHelper.accessor(row => lastSeenMap[row.id] || 0, {
      id: 'lastSeen',
      header: 'Last Seen',
      cell: info => {
        const timestamp = info.getValue()
        if (!timestamp) return <span className="issue-not-seen">Never</span>
        return (
          <span className="issue-date-text">
            {new Date(timestamp).toLocaleDateString()}
          </span>
        )
      },
      enableColumnFilter: false,
      sortingFn: lastSeenSortFn,
    }),
  ]
}

function buildMetadataColumns(
  stateManager: ReturnType<typeof useStateManager>,
  lastSeenMap: Record<string, number>
) {
  return [
    ...buildStatusAndPriorityColumns(stateManager),
    ...buildDateAndLastSeenColumns(lastSeenMap),
  ]
}

function buildColumns(
  lastSeenMap: Record<string, number>,
  stateManager: ReturnType<typeof useStateManager>
) {
  return [
    ...buildIdAndTitleColumns(),
    ...buildMetadataColumns(stateManager, lastSeenMap),
  ]
}

function getCellClassName(columnId: string) {
  if (columnId === 'displayNumber') return 'issue-number'
  if (columnId === 'title') return 'issue-title'
  if (columnId === 'createdAt') return 'issue-date'
  return ''
}

function ColumnFilterControl({
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
        value={(filterValue as string[]) ?? []}
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
        value={(filterValue as string[]) ?? []}
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
      value={(filterValue as string) ?? ''}
      onChange={e => setFilterValue(e.target.value)}
    />
  )
}

function getSortIndicator(sorted: false | 'asc' | 'desc') {
  if (sorted === 'asc') return ' \u25B2'
  if (sorted === 'desc') return ' \u25BC'
  return ''
}

function IssuesTableHead({
  table,
  statusOptions,
}: {
  table: ReturnType<typeof useReactTable<Issue>>
  statusOptions: MultiSelectOption[]
}) {
  return (
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
                    {getSortIndicator(header.column.getIsSorted())}
                  </span>
                </button>
                {header.column.getCanFilter() && (
                  <ColumnFilterControl
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
  )
}

function IssuesTableView({
  table,
  statusOptions,
  onContextMenu,
}: {
  table: ReturnType<typeof useReactTable<Issue>>
  statusOptions: MultiSelectOption[]
  onContextMenu: (e: React.MouseEvent, issue: Issue) => void
}) {
  return (
    <div className="issues-table">
      <table>
        <IssuesTableHead table={table} statusOptions={statusOptions} />
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.original.issueNumber}
              onContextMenu={e => onContextMenu(e, row.original)}
              className="context-menu-row"
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className={getCellClassName(cell.column.id)}>
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

function IssuesListModals({
  projectPath,
  selectedIssue,
  showMoveModal,
  showDuplicateModal,
  showStandaloneModal,
  contextMenu,
  contextMenuItems,
  onCloseMoveModal,
  onMoved,
  onCloseDuplicateModal,
  onDuplicated,
  onCloseStandaloneModal,
  onCloseContextMenu,
}: {
  projectPath: string
  selectedIssue: Issue | null
  showMoveModal: boolean
  showDuplicateModal: boolean
  showStandaloneModal: boolean
  contextMenu: { x: number; y: number; issue: Issue } | null
  contextMenuItems: ContextMenuItem[]
  onCloseMoveModal: () => void
  onMoved: (targetProjectPath: string) => void
  onCloseDuplicateModal: () => void
  onDuplicated: (newIssueId: string, targetProjectPath: string) => void
  onCloseStandaloneModal: () => void
  onCloseContextMenu: () => void
}) {
  return (
    <>
      {contextMenu && (
        <ContextMenu
          items={contextMenuItems}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={onCloseContextMenu}
        />
      )}

      {showMoveModal && selectedIssue && (
        <MoveModal
          entityType="issue"
          entityId={selectedIssue.id}
          entityTitle={selectedIssue.title}
          currentProjectPath={projectPath}
          onClose={onCloseMoveModal}
          onMoved={onMoved}
        />
      )}

      {showDuplicateModal && selectedIssue && (
        <DuplicateModal
          entityType="issue"
          entityId={selectedIssue.id}
          entityTitle={selectedIssue.title}
          currentProjectPath={projectPath}
          onClose={onCloseDuplicateModal}
          onDuplicated={onDuplicated}
        />
      )}

      {showStandaloneModal && projectPath && (
        <StandaloneWorkspaceModal
          projectPath={projectPath}
          onClose={onCloseStandaloneModal}
        />
      )}
    </>
  )
}

function useIssuesListDeps() {
  const router = useRouter()
  const { projectPath, isInitialized } = usePathContext()
  const resolvePathToUrl = useProjectPathToUrl()
  const stateManager = useStateManager()
  const { copyToClipboard } = useCopyToClipboard()
  const { createLink, createProjectLink } = useAppLink()
  const { lastSeenMap } = useLastSeenIssues()
  const { pinItem, unpinItem, isPinned } = usePinnedItems()
  const { sorting, setSorting, columnFilters, setColumnFilters } =
    useIssueTableSettings()

  return {
    router,
    projectPath,
    isInitialized,
    resolvePathToUrl,
    stateManager,
    copyToClipboard,
    createLink,
    createProjectLink,
    lastSeenMap,
    pinItem,
    unpinItem,
    isPinned,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
  }
}

function useIssuesListCoreState() {
  const deps = useIssuesListDeps()
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    issue: Issue
  } | null>(null)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [showStandaloneModal, setShowStandaloneModal] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

  const statusOptions: MultiSelectOption[] = useMemo(
    () =>
      deps.stateManager
        .getStateOptions()
        .map(opt => ({ value: opt.value, label: opt.label })),
    [deps.stateManager]
  )
  const columns = useMemo(
    () => buildColumns(deps.lastSeenMap, deps.stateManager),
    [deps.lastSeenMap, deps.stateManager]
  )

  const table = useReactTable({
    data: issues,
    columns,
    state: { sorting: deps.sorting, columnFilters: deps.columnFilters },
    onSortingChange: deps.setSorting,
    onColumnFiltersChange: deps.setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      copyToClipboard: deps.copyToClipboard,
      createLink: deps.createLink,
    },
  })

  return {
    ...deps,
    issues,
    setIssues,
    loading,
    setLoading,
    error,
    setError,
    table,
    statusOptions,
    contextMenu,
    setContextMenu,
    showMoveModal,
    setShowMoveModal,
    showDuplicateModal,
    setShowDuplicateModal,
    showStandaloneModal,
    setShowStandaloneModal,
    selectedIssue,
    setSelectedIssue,
  }
}

function useFetchIssues(s: ReturnType<typeof useIssuesListCoreState>) {
  const fetchIssues = useCallback(async () => {
    if (!s.projectPath.trim() || s.isInitialized !== true) return
    s.setLoading(true)
    s.setError(null)
    try {
      const request = create(ListIssuesRequestSchema, {
        projectPath: s.projectPath.trim(),
      })
      const response = await centyClient.listIssues(request)
      s.setIssues(response.issues)
    } catch (err) {
      s.setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      s.setLoading(false)
    }
  }, [s])

  useEffect(() => {
    if (s.isInitialized === true) {
      fetchIssues()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.isInitialized, s.projectPath])

  return fetchIssues
}

function useIssuesListContextMenuHandlers(
  s: ReturnType<typeof useIssuesListCoreState>
) {
  const handleContextMenu = useCallback(
    (e: React.MouseEvent, issue: Issue) => {
      e.preventDefault()
      s.setContextMenu({ x: e.clientX, y: e.clientY, issue })
    },
    [s]
  )
  const handleMoveIssue = useCallback(
    (issue: Issue) => {
      s.setSelectedIssue(issue)
      s.setShowMoveModal(true)
      s.setContextMenu(null)
    },
    [s]
  )
  const handleDuplicateIssue = useCallback(
    (issue: Issue) => {
      s.setSelectedIssue(issue)
      s.setShowDuplicateModal(true)
      s.setContextMenu(null)
    },
    [s]
  )
  return { handleContextMenu, handleMoveIssue, handleDuplicateIssue }
}

function useIssuesListNavHandlers(
  s: ReturnType<typeof useIssuesListCoreState>,
  fetchIssues: () => Promise<void>
) {
  const handleMoved = useCallback(
    async (targetProjectPath: string) => {
      const result = await s.resolvePathToUrl(targetProjectPath)
      if (result) {
        s.router.push(
          s.createProjectLink(result.orgSlug, result.projectName, 'issues')
        )
      } else {
        s.router.push('/')
      }
    },
    [s]
  )
  const handleDuplicated = useCallback(
    async (newIssueId: string, targetProjectPath: string) => {
      if (targetProjectPath === s.projectPath) {
        fetchIssues()
        s.router.push(s.createLink(`/issues/${newIssueId}`))
      } else {
        const result = await s.resolvePathToUrl(targetProjectPath)
        if (result) {
          s.router.push(
            s.createProjectLink(
              result.orgSlug,
              result.projectName,
              `issues/${newIssueId}`
            )
          )
        } else {
          s.router.push('/')
        }
      }
      s.setShowDuplicateModal(false)
      s.setSelectedIssue(null)
    },
    [s, fetchIssues]
  )
  return { handleMoved, handleDuplicated }
}

function useIssuesListState() {
  const s = useIssuesListCoreState()
  const fetchIssues = useFetchIssues(s)
  const contextMenuHandlers = useIssuesListContextMenuHandlers(s)
  const navHandlers = useIssuesListNavHandlers(s, fetchIssues)

  return {
    ...s,
    fetchIssues,
    ...contextMenuHandlers,
    ...navHandlers,
  }
}

function buildContextMenuItems(
  state: ReturnType<typeof useIssuesListState>
): ContextMenuItem[] {
  if (!state.contextMenu) return []
  const issue = state.contextMenu.issue
  return [
    {
      label: state.isPinned(issue.issueNumber) ? 'Unpin' : 'Pin',
      onClick: () => {
        if (state.isPinned(issue.issueNumber)) {
          state.unpinItem(issue.issueNumber)
        } else {
          state.pinItem({
            id: issue.issueNumber,
            type: 'issue',
            title: issue.title,
            displayNumber: issue.displayNumber,
          })
        }
        state.setContextMenu(null)
      },
    },
    {
      label: 'View',
      onClick: () => {
        state.router.push(state.createLink(`/issues/${issue.id}`))
        state.setContextMenu(null)
      },
    },
    { label: 'Move', onClick: () => state.handleMoveIssue(issue) },
    { label: 'Duplicate', onClick: () => state.handleDuplicateIssue(issue) },
  ]
}

function IssuesListHeader({
  state,
}: {
  state: ReturnType<typeof useIssuesListState>
}) {
  return (
    <div className="issues-header">
      <h2>Issues</h2>
      <div className="header-actions">
        {state.projectPath && state.isInitialized === true && (
          <button
            onClick={state.fetchIssues}
            disabled={state.loading}
            className="refresh-btn"
          >
            {state.loading ? 'Loading...' : 'Refresh'}
          </button>
        )}
        <button
          onClick={() => state.setShowStandaloneModal(true)}
          className="workspace-btn"
          title="Create a standalone workspace without an issue"
        >
          + New Workspace
        </button>
        <Link href={state.createLink('/issues/new')} className="create-btn">
          + New Issue
        </Link>
      </div>
    </div>
  )
}

function IssuesListContent({
  state,
}: {
  state: ReturnType<typeof useIssuesListState>
}) {
  if (!state.projectPath) {
    return (
      <div className="no-project-message">
        <p>Select a project from the header to view issues</p>
      </div>
    )
  }

  if (state.isInitialized === false) {
    return (
      <div className="not-initialized-message">
        <p>Centy is not initialized in this directory</p>
        <Link href={state.createLink('/')}>Initialize Project</Link>
      </div>
    )
  }

  if (state.isInitialized !== true) return null

  return (
    <>
      {state.error && <DaemonErrorMessage error={state.error} />}
      {state.loading && state.issues.length === 0 ? (
        <div className="loading">Loading issues...</div>
      ) : state.issues.length === 0 ? (
        <div className="empty-state">
          <p>No issues found</p>
          <Link href={state.createLink('/issues/new')}>
            Create your first issue
          </Link>
        </div>
      ) : (
        <IssuesTableView
          table={state.table}
          statusOptions={state.statusOptions}
          onContextMenu={state.handleContextMenu}
        />
      )}
    </>
  )
}

export function IssuesList() {
  const state = useIssuesListState()
  const contextMenuItems = buildContextMenuItems(state)

  return (
    <div className="issues-list">
      <IssuesListHeader state={state} />
      <IssuesListContent state={state} />
      <IssuesListModals
        projectPath={state.projectPath}
        selectedIssue={state.selectedIssue}
        showMoveModal={state.showMoveModal}
        showDuplicateModal={state.showDuplicateModal}
        showStandaloneModal={state.showStandaloneModal}
        contextMenu={state.contextMenu}
        contextMenuItems={contextMenuItems}
        onCloseMoveModal={() => {
          state.setShowMoveModal(false)
          state.setSelectedIssue(null)
        }}
        onMoved={state.handleMoved}
        onCloseDuplicateModal={() => {
          state.setShowDuplicateModal(false)
          state.setSelectedIssue(null)
        }}
        onDuplicated={state.handleDuplicated}
        onCloseStandaloneModal={() => state.setShowStandaloneModal(false)}
        onCloseContextMenu={() => state.setContextMenu(null)}
      />
    </div>
  )
}
