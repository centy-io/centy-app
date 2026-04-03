'use client'

import { DEMO_DOCS } from '../demo-data'
import type { Doc } from '@/gen/centy_pb'

// eslint-disable-next-line @typescript-eslint/require-await
export async function duplicateDoc(): Promise<{
  success: boolean
  doc: Doc
}> {
  console.warn('[Demo Mode] duplicateDoc called - not available in demo mode')
  return { success: true, doc: DEMO_DOCS[0] }
}
