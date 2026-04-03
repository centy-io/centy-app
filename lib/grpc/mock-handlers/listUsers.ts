'use client'

import { DEMO_PROJECT_PATH, DEMO_USERS } from '../demo-data'
import type { ListUsersRequest, ListUsersResponse } from '@/gen/centy_pb'

// eslint-disable-next-line @typescript-eslint/require-await
export async function listUsers(
  request: ListUsersRequest
): Promise<ListUsersResponse> {
  if (request.projectPath !== DEMO_PROJECT_PATH) {
    return {
      $typeName: 'centy.v1.ListUsersResponse',
      users: [],
      totalCount: 0,
      success: true,
      error: '',
    }
  }

  return {
    $typeName: 'centy.v1.ListUsersResponse',
    users: DEMO_USERS,
    totalCount: DEMO_USERS.length,
    success: true,
    error: '',
  }
}
