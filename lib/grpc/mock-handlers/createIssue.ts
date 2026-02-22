'use client'

import { DEMO_ISSUES } from '../demo-data'
import type { Issue } from '@/gen/centy_pb'

export async function createIssue(): Promise<{
  success: boolean
  issue: Issue
}> {
  console.warn('[Demo Mode] createIssue called - changes not persisted')
  return {
    success: true,
    issue: DEMO_ISSUES[0],
  }
}
