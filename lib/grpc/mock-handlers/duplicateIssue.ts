'use client'

import { DEMO_ISSUES } from '../demo-data'
import type { Issue } from '@/gen/centy_pb'

// eslint-disable-next-line @typescript-eslint/require-await
export async function duplicateIssue(): Promise<{
  success: boolean
  issue: Issue
}> {
  console.warn('[Demo Mode] duplicateIssue called - not available in demo mode')
  return { success: true, issue: DEMO_ISSUES[0] }
}
