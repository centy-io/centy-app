'use client'

import { DEMO_USERS } from '../demo-data'
import type { GetUserRequest, User } from '@/gen/centy_pb'
import { UserNotFoundError } from '@/lib/errors'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getUser(request: GetUserRequest): Promise<User> {
  const user = DEMO_USERS.find(u => u.id === request.userId)
  if (user) {
    return user
  }
  throw new UserNotFoundError(request.userId)
}
