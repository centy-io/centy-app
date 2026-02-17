'use client'

import { addBreadcrumb, captureException } from '@sentry/nextjs'

// Daemon connection metrics
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

// Error tracking with context
export function trackError(
  error: Error,
  context: Record<string, unknown> = {}
) {
  captureException(error, {
    extra: context,
  })
}
