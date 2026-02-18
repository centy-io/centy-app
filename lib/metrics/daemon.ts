'use client'

import { addBreadcrumb } from '@sentry/nextjs'

/**
 * Daemon connection metrics
 */
export function trackDaemonConnection(connected: boolean, demoMode: boolean) {
  addBreadcrumb({
    category: 'daemon.status',
    message: connected ? 'Daemon connected' : 'Daemon disconnected',
    level: connected ? 'info' : 'warning',
    data: {
      connected,
      demo_mode: demoMode,
    },
  })
}
