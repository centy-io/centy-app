import type { ProjectInfo } from '@/gen/centy_pb'

export interface ProjectGroup {
  name: string
  projects: ProjectInfo[]
}
