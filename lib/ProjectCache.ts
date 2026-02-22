import type { ProjectInfo } from '@/gen/centy_pb'

/**
 * Cache for project list with TTL
 */
export interface ProjectCache {
  projects: ProjectInfo[]
  timestamp: number
}
