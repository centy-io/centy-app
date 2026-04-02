'use client'

import { demoModeState } from './demoModeState'

// Disable demo mode
export function disableDemoMode(): void {
  demoModeState.disable()
}
