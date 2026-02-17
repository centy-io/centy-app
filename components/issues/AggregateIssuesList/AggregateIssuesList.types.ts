import type { Issue } from '@/gen/centy_pb'

export interface AggregateIssue extends Issue {
  projectName: string
  orgSlug: string | null
  projectPath: string
}
