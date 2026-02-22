'use client'

import { addBreadcrumb } from '@sentry/nextjs'

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
