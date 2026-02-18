'use client'

import { startSpan, addBreadcrumb } from '@sentry/nextjs'

/**
 * gRPC call metrics using Sentry spans and breadcrumbs
 */
export function trackGrpcCall(
  method: string,
  duration: number,
  success: boolean
) {
  addBreadcrumb({
    category: 'grpc.call',
    message: `gRPC ${method}: ${success ? 'success' : 'error'}`,
    level: success ? 'info' : 'error',
    data: {
      method,
      duration_ms: duration,
      status: success ? 'success' : 'error',
    },
  })

  startSpan(
    {
      op: 'grpc.call',
      name: method,
      attributes: {
        'grpc.method': method,
        'grpc.status': success ? 'success' : 'error',
        'grpc.duration_ms': duration,
      },
    },
    span => {
      span.setStatus({
        code: success ? 1 : 2,
        message: success ? 'ok' : 'error',
      })
      span.end()
    }
  )
}
