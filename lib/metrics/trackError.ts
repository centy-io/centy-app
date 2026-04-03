'use client'

import { captureException } from '@sentry/nextjs'

/**
 * Error tracking with context
 */
export function trackError(error: Error, context?: Record<string, unknown>) {
  const resolvedContext = context ?? {}
  captureException(error, {
    extra: resolvedContext,
  })
}
