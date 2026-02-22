import type { ProjectInfo } from '@/gen/centy_pb'

export type GroupedProject = [string, { name: string; projects: ProjectInfo[] }]
