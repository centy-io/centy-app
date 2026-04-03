'use client'

import { DEMO_PROJECT_PATH, DEMO_DOCS } from '../demo-data'
import type { ListDocsRequest, ListDocsResponse } from '@/gen/centy_pb'

// eslint-disable-next-line @typescript-eslint/require-await
export async function listDocs(
  request: ListDocsRequest
): Promise<ListDocsResponse> {
  if (request.projectPath !== DEMO_PROJECT_PATH) {
    return {
      $typeName: 'centy.v1.ListDocsResponse',
      docs: [],
      totalCount: 0,
      success: true,
      error: '',
    }
  }

  return {
    $typeName: 'centy.v1.ListDocsResponse',
    docs: DEMO_DOCS,
    totalCount: DEMO_DOCS.length,
    success: true,
    error: '',
  }
}
