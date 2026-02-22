import type { Doc } from '@/gen/centy_pb'

export interface AggregateDoc extends Doc {
  projectName: string
  orgSlug: string | null
  projectPath: string
}
