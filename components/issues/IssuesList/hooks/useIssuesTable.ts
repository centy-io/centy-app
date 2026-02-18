import { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import type { RouteLiteral } from 'nextjs-routes'
import { createBaseColumns } from '../columns'
import { createPriorityColumn } from '../priorityColumn'
import { createCreatedAtColumn, createLastSeenColumn } from '../dateColumns'
import type { Issue } from '@/gen/centy_pb'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useLastSeenIssues } from '@/hooks/useLastSeenIssues'
import { useIssueTableSettings } from '@/hooks/useIssueTableSettings'
import { useStateManager } from '@/lib/state'
import type { MultiSelectOption } from '@/components/shared/MultiSelect'

export function useIssuesTable(
  issues: Issue[],
  createLink: (path: string) => RouteLiteral
) {
  const stateManager = useStateManager()
  const { copyToClipboard } = useCopyToClipboard()
  const { lastSeenMap } = useLastSeenIssues()
  const { sorting, setSorting, columnFilters, setColumnFilters } =
    useIssueTableSettings()

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
      ...createBaseColumns(copyToClipboard, createLink, stateManager),
      createPriorityColumn(),
      createCreatedAtColumn(),
      createLastSeenColumn(lastSeenMap),
    ],
    [lastSeenMap, stateManager, copyToClipboard, createLink]
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
  })

  return { table, statusOptions }
}
