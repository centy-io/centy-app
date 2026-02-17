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

  const getOrgDisplayName = () => {
    if (selectedOrgSlug === null) return 'All Issues'
    if (selectedOrgSlug === '') return 'Ungrouped Issues'
    const org = organizations.find(o => o.slug === selectedOrgSlug)
    return org?.name ? `${org.name} Issues` : `${selectedOrgSlug} Issues`
  }

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

  const getEmptyMessage = () => {
    if (selectedOrgSlug === null) return 'No issues found across any projects'
    if (selectedOrgSlug === '') return 'No issues found in ungrouped projects'
    const name =
      organizations.find(o => o.slug === selectedOrgSlug)?.name ||
      selectedOrgSlug
    return `No issues found in ${name} organization`
  }

  const getNoteMessage = () => {
    if (selectedOrgSlug === null)
      return 'Showing issues from all projects. Select a project to create new issues.'
    if (selectedOrgSlug === '')
      return 'Showing issues from ungrouped projects. Select a project to create new issues.'
    const name =
      organizations.find(o => o.slug === selectedOrgSlug)?.name ||
      selectedOrgSlug
    return `Showing issues from ${name} organization. Select a project to create new issues.`
  }

  return (
    <div className="issues-list">
      <div className="issues-header">
        <h2>{getOrgDisplayName()}</h2>
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
      <p className="aggregate-note">{getNoteMessage()}</p>
      {error && <DaemonErrorMessage error={error} />}
      {loading && filteredIssues.length === 0 ? (
        <div className="loading">Loading issues...</div>
      ) : filteredIssues.length === 0 ? (
        <div className="empty-state">
          <p>{getEmptyMessage()}</p>
        </div>
      ) : (
        <AggregateIssuesTable table={table} statusOptions={statusOptions} />
      )}
    </div>
  )
}
