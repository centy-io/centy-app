import type { IssueTableSettings } from './IssueTableSettings'

export const DEFAULT_SETTINGS: IssueTableSettings = {
  sorting: [{ id: 'createdAt', desc: true }],
  columnFilters: [{ id: 'status', value: ['open', 'in-progress'] }],
}
