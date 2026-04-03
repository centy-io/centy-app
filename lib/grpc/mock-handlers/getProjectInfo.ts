'use client'

import { DEMO_PROJECT_PATH, DEMO_PROJECT } from '../demo-data'
import type {
  GetProjectInfoRequest,
  GetProjectInfoResponse,
} from '@/gen/centy_pb'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getProjectInfo(
  request: GetProjectInfoRequest
): Promise<GetProjectInfoResponse> {
  if (request.projectPath === DEMO_PROJECT_PATH) {
    return {
      $typeName: 'centy.v1.GetProjectInfoResponse',
      found: true,
      project: DEMO_PROJECT,
      success: true,
      error: '',
    }
  }
  return {
    $typeName: 'centy.v1.GetProjectInfoResponse',
    found: false,
    project: undefined,
    success: true,
    error: '',
  }
}
