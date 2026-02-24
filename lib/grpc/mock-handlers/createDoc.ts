'use client'

import { DEMO_DOCS } from '../demo-data'
import type { CreateDocResponse } from '@/gen/centy_pb'

export async function createDoc(): Promise<CreateDocResponse> {
  console.warn('[Demo Mode] createDoc called - changes not persisted')
  return {
    $typeName: 'centy.v1.CreateDocResponse',
    success: true,
    error: '',
    slug: DEMO_DOCS[0].slug,
    createdFile: '',
    syncResults: [],
  }
}
