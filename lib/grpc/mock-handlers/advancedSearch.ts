'use client'

import { DEMO_ISSUES } from '../demo-data'
import type { Issue } from '@/gen/centy_pb'

export async function advancedSearch(): Promise<{
  issues: Issue[]
}> {
  return { issues: DEMO_ISSUES }
}
