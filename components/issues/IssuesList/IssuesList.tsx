'use client'

import { useState, useMemo } from 'react'
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
import { useIssuesData } from './hooks/useIssuesData'
import { useIssueContextMenu } from './hooks/useIssueContextMenu'
import { createIssueColumns } from './columns'
import { createDateColumns } from './dateColumns'
import { IssuesListContent } from './IssuesListContent'
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
      <IssuesListContent
        projectPath={projectPath}
        isInitialized={isInitialized}
        issues={issues}
        loading={loading}
        error={error}
        table={table}
        statusOptions={statusOptions}
        createLink={createLink}
        onContextMenu={ctx.handleContextMenu}
      />
      <IssuesListModals
        projectPath={projectPath}
        contextMenu={ctx.contextMenu}
        contextMenuItems={ctx.getContextMenuItems()}
        onCloseContextMenu={() => ctx.setContextMenu(null)}
        showMoveModal={ctx.showMoveModal}
        showDuplicateModal={ctx.showDuplicateModal}
        showStandaloneModal={showStandaloneModal}
        selectedIssue={ctx.selectedIssue}
        onCloseMoveModal={ctx.closeMoveModal}
        onCloseDuplicateModal={ctx.closeDuplicateModal}
        onCloseStandaloneModal={() => setShowStandaloneModal(false)}
        onMoved={ctx.handleMoved}
        onDuplicated={ctx.handleDuplicated}
      />
    </div>
  )
}
