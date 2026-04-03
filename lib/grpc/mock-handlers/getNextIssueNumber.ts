'use client'

import { DEMO_ISSUES } from '../demo-data'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getNextIssueNumber(): Promise<{
  nextNumber: number
}> {
  return { nextNumber: DEMO_ISSUES.length + 1 }
}
