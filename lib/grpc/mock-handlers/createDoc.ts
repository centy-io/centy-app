'use client'

import { DEMO_DOCS } from '../demo-data'
import type { Doc } from '@/gen/centy_pb'

export async function createDoc(): Promise<{
  success: boolean
  doc: Doc
}> {
  console.warn('[Demo Mode] createDoc called - changes not persisted')
  return {
    success: true,
    doc: DEMO_DOCS[0],
  }
}
