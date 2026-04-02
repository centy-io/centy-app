'use client'

import { demoModeState } from './demoModeState'

// Enable demo mode
export function enableDemoMode(): void {
  demoModeState.enable()
}
