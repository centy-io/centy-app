'use client'

import { startSpan, captureException } from '@sentry/nextjs'

/**
 * Measure async operation duration using Sentry spans
 */
export async function measureAsync<T>(
  name: string,
  operation: () => Promise<T>,
  tags?: Record<string, string>
): Promise<T> {
  return startSpan(
    {
      op: 'custom',
      name,
      attributes: tags,
    },
    async span => {
      try {
        const result = await operation()
        span.setStatus({ code: 1, message: 'ok' })
        return result
      } catch (error) {
        span.setStatus({ code: 2, message: 'error' })
        throw error instanceof Error ? error : new Error(String(error))
      }
    }
  )
}

/**
 * Error tracking with context
 */
export function trackError(error: Error, context?: Record<string, unknown>) {
  const resolvedContext = context !== undefined ? context : {}
  captureException(error, {
    extra: resolvedContext,
  })
}
