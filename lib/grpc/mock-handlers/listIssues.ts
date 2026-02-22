'use client'

import { DEMO_PROJECT_PATH, DEMO_ISSUES } from '../demo-data'
import type {
  ListIssuesRequest,
  ListIssuesResponse,
} from '@/gen/centy_pb'

// Helper to filter issues by request parameters
function filterIssues(
  issues: typeof DEMO_ISSUES,
  request: ListIssuesRequest
): typeof DEMO_ISSUES {
  let filtered = [...issues]

  if (request.status) {
    filtered = filtered.filter(
      issue => issue.metadata && issue.metadata.status === request.status
    )
  }

  if (request.priority && request.priority > 0) {
    filtered = filtered.filter(
      issue => issue.metadata && issue.metadata.priority === request.priority
    )
  }

  return filtered
}

export async function listIssues(
  request: ListIssuesRequest
): Promise<ListIssuesResponse> {
  if (request.projectPath !== DEMO_PROJECT_PATH) {
    return {
      $typeName: 'centy.v1.ListIssuesResponse',
      issues: [],
      totalCount: 0,
      success: true,
      error: '',
    }
  }

  const filtered = filterIssues(DEMO_ISSUES, request)
  return {
    $typeName: 'centy.v1.ListIssuesResponse',
    issues: filtered,
    totalCount: filtered.length,
    success: true,
    error: '',
  }
}
