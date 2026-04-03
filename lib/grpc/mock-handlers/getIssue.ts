'use client'

import { DEMO_ISSUES } from '../demo-data'
import { findIssueByFlexibleId } from './resolve-issue'
import type { GetIssueRequest, Issue } from '@/gen/centy_pb'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getIssue(request: GetIssueRequest): Promise<{
  success: boolean
  error: string
  issue?: Issue
}> {
  const issue = findIssueByFlexibleId(DEMO_ISSUES, request.issueId)
  if (issue) {
    return { success: true, error: '', issue }
  }
  return {
    success: false,
    error: `Issue ${request.issueId} not found`,
  }
}
