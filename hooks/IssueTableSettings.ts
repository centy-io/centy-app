import type { SortingState, ColumnFiltersState } from '@tanstack/react-table'

export interface IssueTableSettings {
  sorting: SortingState
  columnFilters: ColumnFiltersState
}
