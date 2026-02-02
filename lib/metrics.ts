'use client'

import * as Sentry from '@sentry/nextjs'

/**
 * Metrics tracking utility for Sentry
 * Uses Sentry's breadcrumb and span APIs for tracking custom metrics
 */

// Helper to measure async operation duration using spans
export async function measureAsync<T>(
  name: string,
  operation: () => Promise<T>,
  tags?: Record<string, string>
): Promise<T> {
  return Sentry.startSpan(
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

// gRPC call metrics using spans
export function trackGrpcCall(
  method: string,
  duration: number,
  success: boolean
) {
  // Use breadcrumbs for tracking as they're reliable across Sentry versions
  Sentry.addBreadcrumb({
    category: 'grpc.call',
    message: `gRPC ${method}: ${success ? 'success' : 'error'}`,
    level: success ? 'info' : 'error',
    data: {
      method,
      duration_ms: duration,
      status: success ? 'success' : 'error',
    },
  })

  // Also create a span for performance monitoring
  Sentry.startSpan(
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

// Page navigation metrics using breadcrumbs
export function trackPageView(page: string, loadTime?: number) {
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: `Page view: ${page}`,
    level: 'info',
    data: {
      page,
      ...(loadTime !== undefined && { load_time_ms: loadTime }),
    },
  })
}

// User action metrics using breadcrumbs
export function trackUserAction(
  action: string,
  category: string,
  label?: string
) {
  Sentry.addBreadcrumb({
    category: 'user.action',
    message: `${category}: ${action}`,
    level: 'info',
    data: {
      action,
      category,
      ...(label && { label }),
    },
  })
}

// Feature usage metrics using breadcrumbs
export function trackFeatureUsage(feature: string, details?: string) {
  Sentry.addBreadcrumb({
    category: 'feature.usage',
    message: `Feature used: ${feature}`,
    level: 'info',
    data: {
      feature,
      ...(details && { details }),
    },
  })
}

// Issue operations metrics
export function trackIssueOperation(
  operation: 'create' | 'update' | 'delete' | 'view' | 'move' | 'duplicate',
  projectPath: string
) {
  Sentry.addBreadcrumb({
    category: 'issue.operation',
    message: `Issue ${operation}`,
    level: 'info',
    data: {
      operation,
      project: projectPath,
    },
  })
}

// Document operations metrics
export function trackDocOperation(
  operation: 'create' | 'update' | 'delete' | 'view',
  projectPath: string
) {
  Sentry.addBreadcrumb({
    category: 'doc.operation',
    message: `Document ${operation}`,
    level: 'info',
    data: {
      operation,
      project: projectPath,
    },
  })
}

// Daemon connection metrics
export function trackDaemonConnection(connected: boolean, demoMode: boolean) {
  Sentry.addBreadcrumb({
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
  Sentry.captureException(error, {
    extra: context,
  })
}
