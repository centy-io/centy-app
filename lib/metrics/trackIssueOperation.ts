'use client'

import { addBreadcrumb } from '@sentry/nextjs'

/**
 * Issue operations metrics
 */
export function trackIssueOperation(
  operation: 'create' | 'update' | 'delete' | 'view' | 'move' | 'duplicate',
  projectPath: string
) {
  addBreadcrumb({
    category: 'issue.operation',
    message: `Issue ${operation}`,
    level: 'info',
    data: {
      operation,
      project: projectPath,
    },
  })
}
