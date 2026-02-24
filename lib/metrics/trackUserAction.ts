'use client'

import { addBreadcrumb } from '@sentry/nextjs'

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
