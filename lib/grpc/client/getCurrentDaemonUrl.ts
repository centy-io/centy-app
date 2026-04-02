'use client'

import { getDaemonUrl } from './getDaemonUrl'

// Get the current daemon URL (for display purposes)
export function getCurrentDaemonUrl(): string {
  return getDaemonUrl()
}
