'use client'

import { DEMO_PROJECT_PATH, DEMO_USERS } from '../demo-data'
import type {
  ListUsersRequest,
  ListUsersResponse,
  GetUserRequest,
  User,
} from '@/gen/centy_pb'

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

export async function getUser(request: GetUserRequest): Promise<User> {
  const user = DEMO_USERS.find(u => u.id === request.userId)
  if (user) {
    return user
  }
  throw new Error(`User ${request.userId} not found`)
}
