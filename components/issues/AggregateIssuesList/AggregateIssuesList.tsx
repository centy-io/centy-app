'use client'

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { useAppLink } from '@/hooks/useAppLink'
import { useStateManager } from '@/lib/state'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import type { MultiSelectOption } from '@/components/shared/MultiSelect'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useAggregateIssues } from './hooks/useAggregateIssues'
import { createAggregateColumns } from './columns'
import { createDateColumn } from './dateColumn'
import { AggregateIssuesTable } from './AggregateIssuesTable'
import {
  getOrgDisplayName,
  getEmptyMessage,
  getNoteMessage,
} from './AggregateIssuesListHelpers'

export function AggregateIssuesList() {
  const stateManager = useStateManager()
  const { createProjectLink } = useAppLink()
  const { selectedOrgSlug, organizations } = useOrganization()
  const { issues, loading, error, fetchAllIssues } = useAggregateIssues()
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([
    { id: 'createdAt', desc: true },
  ])
  const [columnFilters, setColumnFilters] = useState<
    { id: string; value: unknown }[]
  >([])

  const filteredIssues = useMemo(() => {
    if (selectedOrgSlug === null) return issues
    if (selectedOrgSlug === '') return issues.filter(i => !i.orgSlug)
    return issues.filter(i => i.orgSlug === selectedOrgSlug)
  }, [issues, selectedOrgSlug])

  const statusOptions: MultiSelectOption[] = useMemo(
    () =>
      stateManager
        .getStateOptions()
        .map(opt => ({ value: opt.value, label: opt.label })),
    [stateManager]
  )
  const columns = useMemo(
    () => [
      ...createAggregateColumns(stateManager, createProjectLink),
      createDateColumn(),
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
        <h2>{getOrgDisplayName(selectedOrgSlug, organizations)}</h2>
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
      <p className="aggregate-note">
        {getNoteMessage(selectedOrgSlug, organizations)}
      </p>
      {error && <DaemonErrorMessage error={error} />}
      {loading && filteredIssues.length === 0 ? (
        <div className="loading">Loading issues...</div>
      ) : filteredIssues.length === 0 ? (
        <div className="empty-state">
          <p>{getEmptyMessage(selectedOrgSlug, organizations)}</p>
        </div>
      ) : (
        <AggregateIssuesTable table={table} statusOptions={statusOptions} />
      )}
    </div>
  )
}
