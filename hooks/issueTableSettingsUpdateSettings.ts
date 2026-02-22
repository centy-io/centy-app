import type { IssueTableSettings } from './useIssueTableSettings.types'
import { issueTableSettingsState } from './issueTableSettingsState'

export function updateSettings(
  projectPath: string,
  updater: (prev: IssueTableSettings) => IssueTableSettings
) {
  const store = issueTableSettingsState.getOrCreate(projectPath)
  store.settings = updater(store.settings)
  issueTableSettingsState.save(projectPath, store.settings)
  store.listeners.forEach(listener => listener())
}
