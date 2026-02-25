import type { RouteLiteral } from 'nextjs-routes'

export interface NavItemType {
  name: string
  plural: string
  itemCount: number
  href: RouteLiteral
}
