'use client'

import { DEMO_PROJECT_PATH, DEMO_DOCS } from '../demo-data'
import type {
  ListDocsRequest,
  ListDocsResponse,
  GetDocRequest,
  Doc,
} from '@/gen/centy_pb'

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
