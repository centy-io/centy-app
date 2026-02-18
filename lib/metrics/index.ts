'use client'

/**
 * Metrics tracking utility for Sentry
 * Uses Sentry's breadcrumb and span APIs for tracking custom metrics
 */

export { measureAsync, trackError } from './measure'
export { trackGrpcCall } from './grpc'
export { trackPageView, trackUserAction, trackFeatureUsage } from './user'
export { trackIssueOperation, trackDocOperation } from './entity'
export { trackDaemonConnection } from './daemon'
