'use client'

import { DEMO_ISSUES } from '../demo-data'
import type { CreateIssueResponse } from '@/gen/centy_pb'

// eslint-disable-next-line @typescript-eslint/require-await
export async function createIssue(): Promise<CreateIssueResponse> {
  console.warn('[Demo Mode] createIssue called - changes not persisted')
  return {
    $typeName: 'centy.v1.CreateIssueResponse',
    success: true,
    error: '',
    id: DEMO_ISSUES[0].id,
    displayNumber: DEMO_ISSUES[0].displayNumber,
    issueNumber: DEMO_ISSUES[0].issueNumber,
    createdFiles: [],
    orgDisplayNumber: 0,
    syncResults: [],
  }
}
