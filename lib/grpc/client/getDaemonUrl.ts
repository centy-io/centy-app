'use client'

import { DEFAULT_DAEMON_URL } from './DEFAULT_DAEMON_URL'
import { DAEMON_URL_STORAGE_KEY } from './DAEMON_URL_STORAGE_KEY'

// Get the daemon URL from localStorage or use default
export function getDaemonUrl(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_DAEMON_URL
  }
  return localStorage.getItem(DAEMON_URL_STORAGE_KEY) || DEFAULT_DAEMON_URL
}
