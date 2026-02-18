import type { Organization } from '@/gen/centy_pb'

export interface ContextMenuState {
  x: number
  y: number
  org: Organization
}
