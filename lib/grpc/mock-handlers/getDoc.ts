'use client'

import { DEMO_DOCS } from '../demo-data'
import type { GetDocRequest, Doc } from '@/gen/centy_pb'

export async function getDoc(request: GetDocRequest): Promise<{
  success: boolean
  error: string
  doc?: Doc
}> {
  const doc = DEMO_DOCS.find(d => d.slug === request.slug)
  if (doc) {
    return { success: true, error: '', doc }
  }
  return {
    success: false,
    error: `Doc ${request.slug} not found`,
  }
}
