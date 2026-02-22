'use client'

import { DEMO_ISSUES } from '../demo-data'

export async function getNextIssueNumber(): Promise<{
  nextNumber: number
}> {
  return { nextNumber: DEMO_ISSUES.length + 1 }
}
