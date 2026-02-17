'use client'

import { DEMO_ORG_SLUG, DEMO_PROJECT_PATH } from '../demo-data'

const DEMO_MODE_STORAGE_KEY = 'centy_demo_mode'

// Demo mode state
let demoModeEnabled = false

// Initialize demo mode from sessionStorage on load
if (typeof window !== 'undefined') {
  demoModeEnabled = sessionStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'true'
}

// Enable demo mode
export function enableDemoMode(): void {
  demoModeEnabled = true
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true')
    // Auto-navigate to demo org and project
    localStorage.setItem('centy-selected-org', DEMO_ORG_SLUG)
    localStorage.setItem('centy-project-path', DEMO_PROJECT_PATH)
  }
}

// Disable demo mode
export function disableDemoMode(): void {
  demoModeEnabled = false
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(DEMO_MODE_STORAGE_KEY)
  }
}

// Check if demo mode is enabled
export function isDemoMode(): boolean {
  return demoModeEnabled
}
