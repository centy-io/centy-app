import type { IssueTableSettings } from './useIssueTableSettings.types'
import { DEFAULT_SETTINGS } from './useIssueTableSettings.types'

const STORAGE_KEY_PREFIX = 'centy-issues-table-settings'

function getStorageKey(projectPath: string): string {
  return `${STORAGE_KEY_PREFIX}-${projectPath}`
}

function loadSettings(projectPath: string): IssueTableSettings {
  if (typeof window === 'undefined' || !projectPath) return DEFAULT_SETTINGS
  try {
    const stored = localStorage.getItem(getStorageKey(projectPath))
    if (!stored) return DEFAULT_SETTINGS
    const parsed: IssueTableSettings = JSON.parse(stored)
    return {
      sorting:
        parsed.sorting !== undefined
          ? parsed.sorting
          : DEFAULT_SETTINGS.sorting,
      columnFilters:
        parsed.columnFilters !== undefined
          ? parsed.columnFilters
          : DEFAULT_SETTINGS.columnFilters,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(projectPath: string, settings: IssueTableSettings): void {
  if (typeof window === 'undefined' || !projectPath) return
  try {
    localStorage.setItem(getStorageKey(projectPath), JSON.stringify(settings))
  } catch {
    // Ignore storage errors
  }
}

const stores = new Map<
  string,
  {
    settings: IssueTableSettings
    listeners: Set<() => void>
  }
>()

function getOrCreateStore(projectPath: string) {
  if (!stores.has(projectPath)) {
    stores.set(projectPath, {
      settings: loadSettings(projectPath),
      listeners: new Set(),
    })
  }
  return stores.get(projectPath)!
}

export function subscribe(projectPath: string, listener: () => void) {
  const store = getOrCreateStore(projectPath)
  store.listeners.add(listener)
  return () => store.listeners.delete(listener)
}

export function getSnapshot(projectPath: string): IssueTableSettings {
  return getOrCreateStore(projectPath).settings
}

export function getServerSnapshot(): IssueTableSettings {
  return DEFAULT_SETTINGS
}

export function updateSettings(
  projectPath: string,
  updater: (prev: IssueTableSettings) => IssueTableSettings
) {
  const store = getOrCreateStore(projectPath)
  store.settings = updater(store.settings)
  saveSettings(projectPath, store.settings)
  store.listeners.forEach(listener => listener())
}
