import type { IssueTableSettings } from './useIssueTableSettings.types'
import { DEFAULT_SETTINGS } from './useIssueTableSettings.types'

const STORAGE_KEY_PREFIX = 'centy-issues-table-settings'

function getStorageKey(projectPath: string): string {
  return `${STORAGE_KEY_PREFIX}-${projectPath}`
}

function loadFromStorage(projectPath: string): IssueTableSettings {
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

interface StoreEntry {
  settings: IssueTableSettings
  listeners: Set<() => void>
}

const storeMap = new Map<string, StoreEntry>()

export const issueTableSettingsState = {
  getOrCreate(projectPath: string): StoreEntry {
    if (!storeMap.has(projectPath)) {
      storeMap.set(projectPath, {
        settings: loadFromStorage(projectPath),
        listeners: new Set(),
      })
    }
    return storeMap.get(projectPath)!
  },
  save(projectPath: string, settings: IssueTableSettings): void {
    if (typeof window === 'undefined' || !projectPath) return
    try {
      localStorage.setItem(getStorageKey(projectPath), JSON.stringify(settings))
    } catch {
      // Ignore storage errors
    }
  },
}
