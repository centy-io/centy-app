'use client'

import { DEMO_ORG_SLUG, DEMO_PROJECT_PATH } from '../demo-data'
import { demoModeState } from './demoModeState'

// Enable demo mode
export function enableDemoMode(): void {
  demoModeState.enable()
  // Auto-navigate to demo org and project
  localStorage.setItem('centy-selected-org', DEMO_ORG_SLUG)
  localStorage.setItem('centy-project-path', DEMO_PROJECT_PATH)
}
