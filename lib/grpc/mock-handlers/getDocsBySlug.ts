'use client'

import type { Doc } from '@/gen/centy_pb'

export async function getDocsBySlug(): Promise<{
  docs: Doc[]
}> {
  return { docs: [] }
}
