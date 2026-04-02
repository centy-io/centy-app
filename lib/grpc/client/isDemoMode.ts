'use client'

import { demoModeState } from './demoModeState'

// Check if demo mode is enabled
export function isDemoMode(): boolean {
  return demoModeState.enabled
}
