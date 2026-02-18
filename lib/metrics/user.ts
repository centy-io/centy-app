'use client'

import { addBreadcrumb } from '@sentry/nextjs'

/**
 * Page navigation metrics using breadcrumbs
 */
export function trackPageView(page: string, loadTime?: number) {
  addBreadcrumb({
    category: 'navigation',
    message: `Page view: ${page}`,
    level: 'info',
    data: {
      page,
      ...(loadTime !== undefined && { load_time_ms: loadTime }),
    },
  })
}

/**
 * User action metrics using breadcrumbs
 */
export function trackUserAction(
  action: string,
  category: string,
  label?: string
) {
  addBreadcrumb({
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

/**
 * Feature usage metrics using breadcrumbs
 */
export function trackFeatureUsage(feature: string, details?: string) {
  addBreadcrumb({
    category: 'feature.usage',
    message: `Feature used: ${feature}`,
    level: 'info',
    data: {
      feature,
      ...(details && { details }),
    },
  })
}
