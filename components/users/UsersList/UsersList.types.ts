import type { User } from '@/gen/centy_pb'
import type { RouteLiteral } from 'nextjs-routes'

export interface ContextMenuState {
  x: number
  y: number
  user: User
}

export interface UsersTableMeta {
  getUserRoute: (userId: string) => RouteLiteral | '/'
}
