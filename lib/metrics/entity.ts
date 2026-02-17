'use client'

import { addBreadcrumb } from '@sentry/nextjs'

// Issue operations metrics
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

// Document operations metrics
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
