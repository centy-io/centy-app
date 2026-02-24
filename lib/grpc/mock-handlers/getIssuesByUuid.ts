'use client'

import type { Issue } from '@/gen/centy_pb'

export async function getIssuesByUuid(): Promise<{
  issues: Issue[]
}> {
  return { issues: [] }
}
