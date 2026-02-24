'use client'

import { DAEMON_URL_STORAGE_KEY } from './DAEMON_URL_STORAGE_KEY'

// Reset to default daemon URL
export function resetDaemonUrl(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(DAEMON_URL_STORAGE_KEY)
  window.location.reload()
}
