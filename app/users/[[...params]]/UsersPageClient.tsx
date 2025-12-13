'use client'

import { useParams, usePathname } from 'next/navigation'
import { UsersList } from '@/components/users/UsersList'
import { UserDetail } from '@/components/users/UserDetail'

export function UsersPageClient() {
  const params = useParams()
  const pathname = usePathname()

  // Extract user ID from URL path (handles both Next.js params and direct URL access)
  const pathParts = pathname.split('/').filter(Boolean)
  const userId =
    (params.params?.[0] as string | undefined) ||
    (pathParts[0] === 'users' && pathParts[1] ? pathParts[1] : undefined)

  if (userId) {
    return <UserDetail userId={userId} />
  }

  return <UsersList />
}
