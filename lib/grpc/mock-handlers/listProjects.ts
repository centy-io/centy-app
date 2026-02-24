'use client'

import { DEMO_PROJECT } from '../demo-data'
import type { ListProjectsRequest, ListProjectsResponse } from '@/gen/centy_pb'

export async function listProjects(
  _request: ListProjectsRequest
): Promise<ListProjectsResponse> {
  return {
    $typeName: 'centy.v1.ListProjectsResponse',
    projects: [DEMO_PROJECT],
    totalCount: 1,
    success: true,
    error: '',
  }
}
