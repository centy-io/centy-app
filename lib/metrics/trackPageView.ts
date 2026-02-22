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
