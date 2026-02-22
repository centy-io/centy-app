import type { IssueTableSettings } from './useIssueTableSettings.types'
import { issueTableSettingsState } from './issueTableSettingsState'

export function getSnapshot(projectPath: string): IssueTableSettings {
  return issueTableSettingsState.getOrCreate(projectPath).settings
}
