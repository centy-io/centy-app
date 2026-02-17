'use client'

import { startSpan } from '@sentry/nextjs'

// Helper to measure async operation duration using spans
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
        throw error
      }
    }
  )
}
