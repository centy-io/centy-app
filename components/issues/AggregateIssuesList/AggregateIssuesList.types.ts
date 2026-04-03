import type { GenericItem } from '@/gen/centy_pb'

export interface AggregateIssue extends GenericItem {
  projectName: string
  orgSlug: string | null
  projectPath: string
}
