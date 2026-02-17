import type { Config, Manifest, ProjectInfo } from '@/gen/centy_pb'

export interface ProjectHandlerOptions {
  projects?: ProjectInfo[]
  isInitialized?: boolean
  config?: Config
  manifest?: Manifest
}
