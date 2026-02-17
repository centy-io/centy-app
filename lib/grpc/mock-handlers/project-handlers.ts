'use client'

import { DEMO_PROJECT_PATH, DEMO_PROJECT } from '../demo-data'
import type {
  ListProjectsRequest,
  ListProjectsResponse,
  GetProjectInfoRequest,
  GetProjectInfoResponse,
  IsInitializedRequest,
  IsInitializedResponse,
} from '@/gen/centy_pb'
import type { MockHandlers } from './types'

export const projectHandlers: MockHandlers = {
  async listProjects(
    _request: ListProjectsRequest
  ): Promise<ListProjectsResponse> {
    return {
      $typeName: 'centy.v1.ListProjectsResponse',
      projects: [DEMO_PROJECT],
      totalCount: 1,
      success: true,
      error: '',
    }
  },

  async getProjectInfo(
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
  },

  async isInitialized(
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
  },
}
