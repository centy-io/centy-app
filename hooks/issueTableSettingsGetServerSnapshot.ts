import type { IssueTableSettings } from './useIssueTableSettings.types'
import { DEFAULT_SETTINGS } from './useIssueTableSettings.types'

export function getServerSnapshot(): IssueTableSettings {
  return DEFAULT_SETTINGS
}
