import type { Issue } from '@/gen/centy_pb'

export interface ContextMenuState {
  x: number
  y: number
  issue: Issue
}
