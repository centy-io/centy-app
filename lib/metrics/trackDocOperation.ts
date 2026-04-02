'use client'

import { addBreadcrumb } from '@sentry/nextjs'

/**
 * Document operations metrics
 */
export function trackDocOperation(
  operation: 'create' | 'update' | 'delete' | 'view',
  projectPath: string
) {
  addBreadcrumb({
    category: 'doc.operation',
    message: `Document ${operation}`,
    level: 'info',
    data: {
      operation,
      project: projectPath,
    },
  })
}
