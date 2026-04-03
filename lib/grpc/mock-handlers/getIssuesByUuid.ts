'use client'

import type { Issue } from '@/gen/centy_pb'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getIssuesByUuid(): Promise<{
  issues: Issue[]
}> {
  return { issues: [] }
}
