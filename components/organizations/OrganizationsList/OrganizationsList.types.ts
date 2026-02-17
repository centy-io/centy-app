import type { Organization } from '@/gen/centy_pb'

export interface OrgContextMenuState {
  x: number
  y: number
  org: Organization
}
