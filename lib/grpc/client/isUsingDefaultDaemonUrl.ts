'use client'

import { DAEMON_URL_STORAGE_KEY } from './DAEMON_URL_STORAGE_KEY'

// Check if using default URL
export function isUsingDefaultDaemonUrl(): boolean {
  if (typeof window === 'undefined') return true
  return !localStorage.getItem(DAEMON_URL_STORAGE_KEY)
}
