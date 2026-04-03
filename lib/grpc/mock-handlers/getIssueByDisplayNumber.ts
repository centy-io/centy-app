'use client'

import { DEMO_ISSUES } from '../demo-data'
import type { GetIssueByDisplayNumberRequest, Issue } from '@/gen/centy_pb'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getIssueByDisplayNumber(
  request: GetIssueByDisplayNumberRequest
): Promise<{
  success: boolean
  error: string
  issue?: Issue
}> {
  const issue = DEMO_ISSUES.find(i => i.displayNumber === request.displayNumber)
  if (issue) {
    return { success: true, error: '', issue }
  }
  return {
    success: false,
    error: `Issue #${request.displayNumber} not found`,
  }
}
