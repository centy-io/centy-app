'use client'

import type { Doc } from '@/gen/centy_pb'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getDocsBySlug(): Promise<{
  docs: Doc[]
}> {
  return { docs: [] }
}
