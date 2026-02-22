import { issueTableSettingsState } from './issueTableSettingsState'

export function subscribe(projectPath: string, listener: () => void) {
  const store = issueTableSettingsState.getOrCreate(projectPath)
  store.listeners.add(listener)
  return () => store.listeners.delete(listener)
}
