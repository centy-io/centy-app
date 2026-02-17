'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useAppLink } from '@/hooks/useAppLink'
import { useLastSeenIssues } from '@/hooks/useLastSeenIssues'
import { useIssueTableSettings } from '@/hooks/useIssueTableSettings'
import { useStateManager } from '@/lib/state'
import type { MultiSelectOption } from '@/components/shared/MultiSelect'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useIssuesData } from './hooks/useIssuesData'
import { useIssueContextMenu } from './hooks/useIssueContextMenu'
import { createIssueColumns } from './columns'
import { createDateColumns } from './dateColumns'
import { IssuesTable } from './IssuesTable'
import { IssuesListModals } from './IssuesListModals'
import { IssuesListHeader } from './IssuesListHeader'

export function IssuesList() {
  const { projectPath, isInitialized } = usePathContext()
  const stateManager = useStateManager()
  const { copyToClipboard } = useCopyToClipboard()
  const { createLink } = useAppLink()
  const { lastSeenMap } = useLastSeenIssues()
  const { sorting, setSorting, columnFilters, setColumnFilters } =
    useIssueTableSettings()
  const { issues, loading, error, fetchIssues } = useIssuesData(
    projectPath,
    isInitialized
  )
  const ctx = useIssueContextMenu(projectPath, fetchIssues)
  const [showStandaloneModal, setShowStandaloneModal] = useState(false)
  const statusOptions: MultiSelectOption[] = useMemo(
    () =>
      stateManager
        .getStateOptions()
        .map(opt => ({ value: opt.value, label: opt.label })),
    [stateManager]
  )
  const columns = useMemo(
    () => [
      ...createIssueColumns(stateManager),
      ...createDateColumns(lastSeenMap),
    ],
    [lastSeenMap, stateManager]
  )
  const table = useReactTable({
    data: issues,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: { copyToClipboard, createLink },
  })

  return (
    <div className="issues-list">
      <IssuesListHeader
        projectPath={projectPath}
        isInitialized={isInitialized}
        loading={loading}
        createLink={createLink}
        onRefresh={fetchIssues}
        onNewWorkspace={() => setShowStandaloneModal(true)}
      />
      {!projectPath && (
        <div className="no-project-message">
          <p>Select a project from the header to view issues</p>
        </div>
      )}
      {projectPath && isInitialized === false && (
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href={createLink('/')}>Initialize Project</Link>
        </div>
      )}
      {projectPath && isInitialized === true && (
        <>
          {error && <DaemonErrorMessage error={error} />}
          {loading && issues.length === 0 ? (
            <div className="loading">Loading issues...</div>
          ) : issues.length === 0 ? (
            <div className="empty-state">
              <p>No issues found</p>
              <Link href={createLink('/issues/new')}>
                Create your first issue
              </Link>
            </div>
          ) : (
            <IssuesTable
              table={table}
              statusOptions={statusOptions}
              onContextMenu={ctx.handleContextMenu}
            />
          )}
        </>
      )}
      <IssuesListModals
        projectPath={projectPath}
        contextMenu={ctx.contextMenu}
        contextMenuItems={ctx.getContextMenuItems()}
        onCloseContextMenu={() => ctx.setContextMenu(null)}
        showMoveModal={ctx.showMoveModal}
        showDuplicateModal={ctx.showDuplicateModal}
        showStandaloneModal={showStandaloneModal}
        selectedIssue={ctx.selectedIssue}
        onCloseMoveModal={() => {
          ctx.setShowMoveModal(false)
          ctx.setSelectedIssue(null)
        }}
        onCloseDuplicateModal={() => {
          ctx.setShowDuplicateModal(false)
          ctx.setSelectedIssue(null)
        }}
        onCloseStandaloneModal={() => setShowStandaloneModal(false)}
        onMoved={ctx.handleMoved}
        onDuplicated={ctx.handleDuplicated}
      />
    </div>
  )
}
