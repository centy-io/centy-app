import type { SortingState, ColumnFiltersState } from '@tanstack/react-table'

export interface IssueTableSettings {
  sorting: SortingState
  columnFilters: ColumnFiltersState
}

export const STORAGE_KEY_PREFIX = 'centy-issues-table-settings'

export const DEFAULT_SETTINGS: IssueTableSettings = {
  sorting: [{ id: 'createdAt', desc: true }],
  columnFilters: [{ id: 'status', value: ['open', 'in-progress'] }],
}
