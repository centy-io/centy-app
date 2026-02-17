'use client'

import { DEMO_PROJECT_PATH, DEMO_ISSUES } from '../demo-data'
import type {
  ListIssuesRequest,
  ListIssuesResponse,
  GetIssueRequest,
  GetIssueByDisplayNumberRequest,
  Issue,
} from '@/gen/centy_pb'
import type { MockHandlers } from './types'

// Helper to filter issues by request parameters
function filterIssues(
  issues: typeof DEMO_ISSUES,
  request: ListIssuesRequest
): typeof DEMO_ISSUES {
  let filtered = [...issues]

  // status is a single string, filter if provided
  if (request.status) {
    filtered = filtered.filter(
      issue => issue.metadata && issue.metadata.status === request.status
    )
  }

  // priority is a single number, filter if > 0
  if (request.priority && request.priority > 0) {
    filtered = filtered.filter(
      issue => issue.metadata && issue.metadata.priority === request.priority
    )
  }

  return filtered
}

export const issueHandlers: MockHandlers = {
  async listIssues(request: ListIssuesRequest): Promise<ListIssuesResponse> {
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
  },

  async getIssue(
    request: GetIssueRequest
  ): Promise<{ success: boolean; error: string; issue?: Issue }> {
    const issue = DEMO_ISSUES.find(i => i.id === request.issueId)
    if (issue) {
      return { success: true, error: '', issue }
    }
    return { success: false, error: `Issue ${request.issueId} not found` }
  },

  async getIssueByDisplayNumber(
    request: GetIssueByDisplayNumberRequest
  ): Promise<{ success: boolean; error: string; issue?: Issue }> {
    const issue = DEMO_ISSUES.find(
      i => i.displayNumber === request.displayNumber
    )
    if (issue) {
      return { success: true, error: '', issue }
    }
    return {
      success: false,
      error: `Issue #${request.displayNumber} not found`,
    }
  },
}
