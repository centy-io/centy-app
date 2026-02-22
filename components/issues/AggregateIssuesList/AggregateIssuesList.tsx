'use client'

import { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { useAggregateIssues } from './hooks/useAggregateIssues'
import { createAggregateColumns } from './columns'
import { createPriorityColumn, createCreatedAtColumn } from './dateColumns'
import { AggregateTable } from './AggregateTable'
import { useAppLink } from '@/hooks/useAppLink'
import { useStateManager } from '@/lib/state'
import type { MultiSelectOption } from '@/components/shared/MultiSelect'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function AggregateIssuesList() {
  const stateManager = useStateManager()
  const { createProjectLink } = useAppLink()

  const {
    filteredIssues,
    loading,
    error,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    fetchAllIssues,
    getOrgDisplayName,
    getOrgNoteText,
    getEmptyText,
  } = useAggregateIssues()

  const statusOptions: MultiSelectOption[] = useMemo(
    () =>
      stateManager.getStateOptions().map(opt => ({
        value: opt.value,
        label: opt.label,
      })),
    [stateManager]
  )

  const columns = useMemo(
    () => [
      ...createAggregateColumns(stateManager, createProjectLink),
      createPriorityColumn(stateManager),
      createCreatedAtColumn(),
    ],
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

  return (
    <div className="issues-list">
      <div className="issues-header">
        <h2 className="issues-title">{getOrgDisplayName()}</h2>
        <div className="header-actions">
          <button
            onClick={fetchAllIssues}
            disabled={loading}
            className="refresh-btn"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <p className="aggregate-note">{getOrgNoteText()}</p>

      {error && <DaemonErrorMessage error={error} />}

      {loading && filteredIssues.length === 0 ? (
        <div className="loading">Loading issues...</div>
      ) : filteredIssues.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">{getEmptyText()}</p>
        </div>
      ) : (
        <AggregateTable table={table} statusOptions={statusOptions} />
      )}
    </div>
  )
}
