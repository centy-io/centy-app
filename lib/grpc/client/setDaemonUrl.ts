'use client'

import { DAEMON_URL_STORAGE_KEY } from './DAEMON_URL_STORAGE_KEY'

// Set the daemon URL in localStorage
export function setDaemonUrl(url: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(DAEMON_URL_STORAGE_KEY, url)
  // Trigger a page reload to reinitialize the client with the new URL
  window.location.reload()
}
