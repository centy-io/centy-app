'use client'

import { DEMO_ISSUES } from '../demo-data'
import type { GetIssueRequest, Issue } from '@/gen/centy_pb'

export async function getIssue(request: GetIssueRequest): Promise<{
  success: boolean
  error: string
  issue?: Issue
}> {
  const issue = DEMO_ISSUES.find(i => i.id === request.issueId)
  if (issue) {
    return { success: true, error: '', issue }
  }
  return {
    success: false,
    error: `Issue ${request.issueId} not found`,
  }
}
