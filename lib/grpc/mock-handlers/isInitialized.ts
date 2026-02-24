'use client'

import { DEMO_PROJECT_PATH } from '../demo-data'
import type {
  IsInitializedRequest,
  IsInitializedResponse,
} from '@/gen/centy_pb'

export async function isInitialized(
  request: IsInitializedRequest
): Promise<IsInitializedResponse> {
  return {
    $typeName: 'centy.v1.IsInitializedResponse',
    initialized: request.projectPath === DEMO_PROJECT_PATH,
    centyPath:
      request.projectPath === DEMO_PROJECT_PATH
        ? `${DEMO_PROJECT_PATH}/.centy`
        : '',
  }
}
